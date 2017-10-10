import React from 'react'
import PropTypes from 'prop-types'
import invariant from 'invariant'
import {createLocation} from 'history'
import {stringifyQuery} from './'


const isModifiedEvent = (event) =>
    !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)


/**
 * The public API for rendering a history-aware <a>.
 */
class Link extends React.Component {
    static propTypes = {
        onClick: PropTypes.func,
        target: PropTypes.string,
        replace: PropTypes.bool,
        to: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]).isRequired,
        innerRef: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.func
        ])
    }

    static defaultProps = {
        replace: false
    }

    static contextTypes = {
        router: PropTypes.shape({
            history: PropTypes.shape({
                push: PropTypes.func.isRequired,
                replace: PropTypes.func.isRequired,
                createHref: PropTypes.func.isRequired
            }).isRequired
        }).isRequired,
        resolver: PropTypes.object.isRequired
    }

    handleClick = (event) => {
        if (this.props.onClick)
            this.props.onClick(event)

        if (
            !event.defaultPrevented && // onClick prevented default
            event.button === 0 && // ignore everything but left clicks
            !this.props.target && // let browser handle "target=_blank" etc.
            !isModifiedEvent(event) // ignore clicks with modifier keys
        ) {
            event.preventDefault()

            const {history} = this.context.router
            const {to} = this.props
            this.context.resolver.resolve(this.normalizeTo(to)).then(() => {
                const {replace} = this.props
                if (replace) {
                    history.replace(to)
                } else {
                    history.push(to)
                }
            })
        }
    }

    normalizeTo = (to) => {
        if (typeof to === 'string') {
            return {
                pathname: to,
            }
        }

        const {query, ...rest} = to
        if (query) {
            return {
                ...rest,
                search: stringifyQuery(to.query)
            }
        }

        return rest
    }


    render() {
        // eslint-disable-line no-unused-vars
        const {replace, to, innerRef, ...props} = this.props

        invariant(
            this.context.router,
            'You should not use <Link> outside a <Router>'
        )

        const {history} = this.context.router
        const location = typeof to === 'string' ? createLocation(to, null, null, history.location) : this.normalizeTo(to)


        const href = history.createHref(location)
        return <a {...props} onClick={this.handleClick} href={href} ref={innerRef}/>
    }
}


export default Link