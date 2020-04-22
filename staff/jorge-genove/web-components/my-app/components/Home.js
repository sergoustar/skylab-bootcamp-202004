class Home extends Component {
  constructor(name, callback) {
   super(`<section class="home">
   <h1>Welcome, ${name}!</h1><button>Logout</button>
</section>`)
    
const button = this.container.querySelector("button");

    button.addEventListener("click", function () {
      callback();
    });

    let results;
    const self = this;
    this.container.appendChild(new Search(function (query) {
        const user = searchUsers(query);

        if (!results) {
          results = new Result(user);
          self.container.appendChild(results.container);
        } else {
          const _results = results;
          results = new Result(user);
          _results.container.replaceWith(results.container);
        }
      }).container);
  }
}
