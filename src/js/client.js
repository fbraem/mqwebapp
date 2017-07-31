import axios from 'axios';

var client = {};

['get', 'post'].forEach((verb) => {
    client[verb] = (url, options) => {
      var opts = options || Object.create(null);
      opts.headers = opts.headers || {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      };
      opts.method = verb;
      opts.url = url;
      return axios.request(opts)
        .then((res) => {
          return res;
        }).catch((error) => {
          throw(error);
        })
    };
});

export default client;
