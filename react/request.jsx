const json_or_empty = (response) => {
    try {
        return response.json()
    } catch (error) {
        return {}
    }
}

const do_get = (url='/') => {
    // Vanilla GET. Returns json promise
    return fetch(
        url
    ).then(
        response => json_or_empty(response)
    );
    //e.g.    .then(data => this.setState({data}));
}

const do_post = (body, url='/') => {
    // Vanilla POST of JSON body. Returns json promise
    return fetch(
        url, 
        {
            method : 'POST',
            headers: {'Content-Type':'application/json'},
            body   : JSON.stringify(body)
        }
    ).then( response => json_or_empty(response));
    //e.g.  .then(data => this.setState({ postId: data.id }));
}

const do_put = (body, url='/') => {
    // Vanilla PUT of JSON body. Returns json promise
    return fetch(
        url,
        {
            method : 'PUT',
            headers: {'Content-Type':'application/json'},
            body   : JSON.stringify(body)
        }
    ).then(
        response => json_or_empty(response)
    );
    //e.g.  .then(data => this.setState({ postId: data.id }));
}

const do_delete = (body, url='/') => {
    // Vanilla DELETE returning {'result':?} promise
    return fetch(
        url,
        {
            method : 'DELETE',
            headers: {'Content-type':'application/json'}
        }
    ).then(
        response => {
            return {
                'result': response.ok || (data && data.message) || response.status
            }
        }
    );
}

export {do_get, do_post, do_put, do_delete};