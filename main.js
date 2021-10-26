// GET REQUEST
function getTodo() {
  // axios({
  //   method: 'GET',
  //   url: 'https://jsonplaceholder.typicode.com/todos',
  //   // 参数项： _limit 应该是后端自己做的...
  //   params: {
  //     _limit:5
  //   }
  // })
  // .then(res => console.log('res', res.data))
  // .catch(err => console.log('err', err))

  // 这种方法和上述方法是一模一样的... 
  // axios.get('https://jsonplaceholder.typicode.com/todos', {
  //   params: {
  //     _limit:5
  //   }
  // })
  // .then(res => console.log('res', res.data))
  // .catch(err => console.log('err', err))

  // 甚至还可以化简... 对于get请求可以不写get...
  axios('https://jsonplaceholder.typicode.com/todos?_limit=5')
  .then(res => console.log('res', res.data))
  .catch(err => console.log('err', err))
}


// POST REQUEST
function postTodo() {
  axios({
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/todos',
    // 不是params哦~
    data: {
      // 这些属性是自己随意拟定的...
      title: 'New To Do',
      complete: false,
      age: 28,
      name: '帅得乱七八糟'
    }
  })
  .then(res => console.log('res', res.data))
  .catch(err => console.log('err', err))

  // // 下述方法同上
  // axios.post('https://jsonplaceholder.typicode.com/todos', {
  //   title: 'New To Do',
  //   completed: false,
  // })
  // .then(res => console.log('res', res.data))
  // .catch(err => console.log('err', err))
}

// PUT/PATCH  注意PUT 一般是更换整体  而PATCH 一般是更换局部内容
// 注意 一般使用PUT 或 PATCH 都是要有参数具体指定修改哪一个内容的
// 所以 PUT 既要指定 params属性 又要修改 data属性
function putTodo() {
  axios({
    method: 'PUT',
    url: 'https://jsonplaceholder.typicode.com/todos/1',
    // 不是params哦~
    data: {
      // 这些属性是自己随意拟定的...
      title: 'Update To Do',
      completed: true,
    }
  })
  .then(res => console.log('res', res.data))
  .catch(err => console.log('err', err))
}

// DELETE 这个只需指定params 而没有data属性
function deleteTodo(){
  axios({
    method: 'DELETE',
    url: 'https://jsonplaceholder.typicode.com/todos/1',
  })  
  .then(res => console.log('res', res.data))
  .catch(err => console.log('err', err))
}


// SIMULATANEOUS DATA (同时请求多种数据)
function getData() {
  // axios
  // .all([
  //   axios.get('https://jsonplaceholder.typicode.com/todos'),
  //   axios.get('https://jsonplaceholder.typicode.com/posts')
  // ])
  // .then(res => {
  //   console.log(res[0]);
  //   console.log(res[1]);
  // })
  // .catch(err => console.log(err));

  // 下述方法同上
  axios.
  all([
    axios.get('https://jsonplaceholder.typicode.com/todos'),
    axios.get('https://jsonplaceholder.typicode.com/posts')  
  ]).then(axios.spread((todos, posts) => {
    console.log(todos);
    console.log(posts)
  }))
  .catch(err => console.log(err))
}

// INTERCEPTING REQUESTS & RESPONSES
// 拦截器
axios.interceptors.request.use(
  config => {
    console.log(
      `${config.method.toUpperCase()} request sent to ${config.url} at ${new Date().getTime()}`
    )
    return config;
  }, 
  error => {
    return Promise.reject(error);
  }
)

// CUSTOM HEADERS  --->   例如登录注册功能实现(采用token)
function customHeaders() {

  const config = {
    headers: {
      'Content-Type':'application/json',
      Authorization: 'sometoken-jwt'
    }
  }

  axios.post('https://jsonplaceholder.typicode.com/todos', {
    title: 'New Todo',
    completed: false
  },
    config
  )
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log(err);
  })
}

// TRANSFORMING REQUESTS & RESPONSES ---> 这个说实话，我还没怎么看懂
function transformResponse() {
  const options = {
    method: 'post',
    url: 'https://jsonplaceholder.typicode.com/todos',
    data: {
      title: 'Hello World'
    },
    transformResponse: axios.defaults.transformResponse.concat(data => {
      data.title = data.title.toUpperCase();
      return data;
    })
  }
  axios(options).then(res => {console.log(res)})
}

// AXIOS GLOBALS  ---> 写在全局(每次请求的时候，X-Auth-Token就会自动放在headers里面)
axios.defaults.headers.common['X-Auth-Token'] = 'sometoken';

// ERROR HANDLING
function errorHandling() {
  axios.get('https://jsonplaceholder.typicode.com/todoss')
  .then(res => {console.log(res)})
  .catch(err => {
    if (err.response) {
      console.log(err.response.data);
      console.log(err.response.status);
      console.log(err.response.headers);
      if (err.response.status === 404) {
        alert('Error: Page Not Found');
      }
    } else if (err.request) {
      console.error(err.request);
    } else {
      console.error(err.message)
    }
  })
}

// CANCEL TOKEN ---->  防止重复点击发送请求 请求获得的数据却不是最新的数据...
function cancelToken() {
  const source = axios.CancelToken.source();
  axios
  .get('https://jsonplaceholder.typicode.com/todos', {
    cancelToken: source.token
  })
  .then(res => console.log(res))
  .catch(thrown => {
    if (axios.isCancel(thrown)) {
      console.log('Request canceled', thrown.message)
    }
  })
}


// AXIOS INSTANCE
const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com'
});

// 省略自己写https://jsonplaceholder.typicode.com内容
axiosInstance.get('/todos')


document.getElementById('get').addEventListener('click', getTodo);
document.getElementById('post').addEventListener('click', postTodo);
document.getElementById('put').addEventListener('click', putTodo);
document.getElementById('delete').addEventListener('click', deleteTodo);
document.getElementById('simulataneous').addEventListener('click', getData);
document.getElementById('error-handling').addEventListener('click', errorHandling);