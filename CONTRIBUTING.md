# Contributing

Thanks for your willingness to contribute! Please make sure to check with me
before doing a bunch of work on something.

## Project setup

If you do need to set the project up locally yourself, feel free to follow these
instructions:

### System Requirements

- [Node](https://nodejs.org/) >= 18.0.0
- [pnpm](https://pnpm.io) >= 8.0.0
- [git](https://git-scm.com/) >= 2.38.0

### Setup steps

1.  Fork and clone the repo
2.  Copy `.env.example` into `.env`
3.  Run `npm install && npm run setup -s` to install dependencies and run
    validation
4.  Create a branch for your PR with `git checkout -b pr/your-branch-name`

> Tip: Keep your `main` branch pointing at the original repository and make pull
> requests from branches on your fork. To do this, run:
>
> ```
> git remote add upstream https://github.com/drewjs/house-stack.git
> git fetch upstream
> git branch --set-upstream-to=upstream/main main
> ```
>
> This will add the original repository as a "remote" called "upstream," Then
> fetch the git information from that remote, then set your local `main` branch
> to use the upstream main branch whenever you run `git pull`. Then you can make
> all of your pull request branches based on this `main` branch. Whenever you
> want to update your version of `main`, do a regular `git pull`.

If the setup script doesn't work, you can try to run the commands manually:

```sh
git clone <your-fork>
cd ./house-stack

# copy the .env.example to .env
#   everything's mocked out during development so you shouldn't need to
#   change any of these values unless you want to hit real environments.
cp .env.example .env

# install deps
pnpm install

# setup database
pnpm run setup

# install playwright browsers
pnpm test:e2e:install

# lint
pnpm lint

# typecheck
pnpm typecheck

# build
pnpm build

```

If that all worked without trouble, you should be able to start development
with:

```sh
pnpm dev
```

And open up `http://localhost:3000` and rock!
