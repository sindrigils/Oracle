# Oracle - Personal Finance Management

The project should work like this: A personal finance management application where users can create households to track their family's financial activities including expenses, income, investments, and loans.

## Key Features:
- **User Authentication**: Users create accounts with username/email and password authentication via sessions
- **Household Management**: Users can create households (family groups) and add members
- **Budgeting**: Monthly budgets with planned amounts, tracking expenses by categories and income sources
- **Expense Tracking**: Categorized expenses with custom categories and color coding
- **Investment Portfolio**: Track investment assets owned by household members, including transactions (buy/sell/dividends/interest) and valuation history
- **Loan Management**: Track loans with member shares, payment history, and outstanding balance snapshots

## Tech Stack:
- Backend: FastAPI with SQLAlchemy ORM
- Database: PostgreSQL
- Authentication: bcrypt password hashing with session tokens
- Migrations: Alembic
- Frontend: NextJS. With ReactQuery, and Axious and Tailwind for CSS

## Frontend folder strutcture example
src/
  app/
    layout.tsx
    page.tsx
    (marketing)/
      page.tsx
    dashboard/
      page.tsx
      settings/
        page.tsx
    providers.tsx

  core/
    components/
      button.tsx
      input.tsx
      card.tsx
      header.tsx
      footer.tsx
      sidebar.tsx
      loader.tsx
      error-state.tsx
    hooks/
      any hooks that need to be reused in multiple apps

  api/
    auth/
      requests.ts // all the axious requests and the types neeeded
      hooks.ts // the react query hooks that wrap the request from requests.ts. the app never calls a direct request always uses the hooks
    users/
      requests.ts
      hooks.ts

  lib/
    axios.ts          // axios instance
    react-query.ts    // queryClient, QueryClientProvider wrapper
    env.ts            // env helpers (base URL etc.)

  types/
    global.ts         // shared types/interfaces

  styles/
    globals.css
    tailwind.css      // if using Tailwind

## Explaination of how the system should work.
Please always take a look at the database model for refernces to understand the context better.
A user can sign up into the website by registirng for an account and then he can log in and then a default member (himself) has been created and thats the main member (need to mark him the db as the main member since he is the user) and now he can create more members like create a memner for his GF and then she can log in with his account. However note that the same account can be logged in multiple times (does that currently work with the current session logic?) even tho there is just 1 member and 2 logged in thats alright, like there is no correlation between them but the use case is that my GF logs in and she can add investments and etc just on her, more on that later. Now each user has one household that he operates in, currently each user has only one household but I have the backend configured that we can allow multiple households per user but tahts not needed for now. Now the user can open his monthly budget page and set the budget for the month and then he should be able to add expenses that he had this month and set on what category this expense belongs into. There should always be default Categories like Groceries and etc, but then the member can alos create their own custom category. And we always open the montly budget for the current month so if a new month comes then we create a model for that month and display it, and the members can always go back in time to see previous months. And the monthly budget just lives in the houshold so its shared for all of the members in the household. Now we also need a page for LOANS and loans can be set on a single member or multiple members. And we always need to create the loan by putting in basic informaiton about it, and then the member can put payments into the loan and thus we need to update the loan balance and etc, also we need to keep track of the loan progression over time, so we need to take a snapshot of it each month. Now we also need a page for investments this can be tied to one user or multiple users, and same with t he loans we need to keep a snapshot of them and also the members needs to set in the inital holdings and then they can update it with buy or sell positions. Lastly but least we have one page called networth where you can select the netwroth for member X or netwroth for both members X and Y combined. This is not its own database model instead we can computed this on the fly, however it would be ideal to be able to keep track of the members networth over time, so maybe just compute it back into time or have a new model for that.

The page should be modern styling and have a good user experience interacting with it, this page should impress frontend developers. WE need to create core components in core/components that will be components like Button and Stack and etc. The pages should reuse the components as much as possible, that will help in less bloat of tailwind classes in the pages components. If the button needs to be sligthly different in one place then another then add some props into the Button, however buttons and all componenrs used throughout the system should be similar, buttons that serve the same purpose in two different places in the system should be the same button, but if they are differenrt in behaviour then they can be different configurations on the button. The backend follows FastAPI best practices and should be clean and readable and reusable code that favours DI. WE also need to take into security into account like making sure that hte delete operation on this ID is actally an ID that the current user has acces to and etc.

All of these plans should be created in a folder called /dev/active/[plan-name] in root. And in this [plan-name] dir we need the following files: context.md, plan.md and tasks.md. The implementation should be split into multiple phases so after completeing one phase we can review or stop and pick the next phase later. And the files should be populated and updated throughout the progression of implementing the plan.

We need to create the following implementation plans (each plan needs good planinng on how to implement this in the frontend side and also the backend side):
0. Setup the frontend structure
1. Login and register pages. The authentication system should be like this -> the backend stores sessions and we manage them, these sessions should be stored in http only cookies, and each time we get a reqeust and the current session i close to the expiration date then we refres the session for the user.
2. Create the home page, which should have cards or something to lead the user to each site: monthly budget, investments, loans, netwroth and then we need a settings page where we can add new members and manage current members.
3. Create the monthly budget planner page, with all the requirements from the system explainnation above.
TBA