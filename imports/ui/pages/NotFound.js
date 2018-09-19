import React, {Component} from 'react';

class NotFound extends Component {
    render() {
        return (
            <aside className="right-side" style={{width: 100 + "%", marginLeft: 0 + 'px', height: 100 + 'vh'}}>
                <section className="content">

                    <div className="error-page">
                        <h2 className="headline text-info"> 404</h2>
                        <div className="error-content">
                            <h3><i className="fa fa-warning text-yellow"/> Oops! Page not found.</h3>
                            <p>
                                We could not find the page you were looking for.
                                Meanwhile, you may <a href='/'>return to dashboard</a> or try using the search form.
                            </p>
                            <form className='search-form'>
                                <div className='input-group'>
                                    <input type="text" name="search" className='form-control' placeholder="Search"/>
                                    <div className="input-group-btn">
                                        <button type="submit" name="submit" className="btn btn-primary"><i
                                            className="fa fa-search"/></button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </section>
            </aside>
        );
    }
}

export default NotFound;