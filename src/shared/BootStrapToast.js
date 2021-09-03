import React, { Component } from 'react'


function getToasts() {
    var toastElList = [].slice.call(document.querySelectorAll('.toast'))
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl)
    })
    return toastList;
}

class BootStrapToast extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div  class="position-fixed bottom-0 end-0 p-3" >
                <div id={this.props.id} className="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <strong class="me-auto">{this.props.title}</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        {this.props.message}
                    </div>
                </div>
            </div>
        )
    }
}

export {BootStrapToast, getToasts}
