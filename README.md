# CS35L-Team-Project

## Taskify

Taskify is a Task Management website where managers of companies can register users, assign tasks to them, track the progress of those tasks, and view the "schedule view" of the tasks. Regular users can view the tasks assigned to them and update their statuses if those are changed.
```Repository link - https://github.com/HaykChilingaryan/CS35L-Team-Project.git```

## Key Features

- User Authentication
  - Registration - Users get an email once their manager registers them to Taskify, which includes credentials
  - Login - Using credentials provided in the email
  - Logout - Finish user session
- Task creation/deletion, assignment to users, status update
- Schedule view of tasks, showing dates when users have tasks due
- Searching between the user tasks by the title or description
- Sorting tasks in
  - Title order
  - Due date order
  - Assignee name order
- Profile view
  - User information
  - Password change
 
## Member's Major Contributions
- Hayk Chilingaryan
  - Backend/Frontend
  - User Authentication
  - Task List
  - Side Bar
  - Calendar View
  - Profile Page
- Albert Mkhitaryan
  - Backend, Side Bar and Routing 
- Eric Tran
  - Frontend, Calendar View
- Donna Wu
  - Frontend, Profile Page
- Adrian Pu
  - Backend, Task Handling, User Registration  

## Running the Application

> [!NOTE]
> For the Api Keys please refer to the document sent in the email by the subject - `Final Project credentials` from `email`.

```
git clone https://github.com/HaykChilingaryan/CS35L-Team-Project.git
```

### Frontend

After the installation of neccessary packages, the frontend will run on port localhost:3000

```
cd CS35L-Team-Project
cd taskify
cd frontend
npm install
npm run dev
```

### Backend

After the installation of neccessary packages, backend will run on port localhost:8000

```
cd CS35L-Team-Project
cd taskify
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python ./manage.py runserver localhost:8000
```

> [!IMPORTANT]
> If there are any issues with running the backend and frontend applications, please Email `email`.

Once both frontend and backend are up, the application will be hosted on localhost:8000

> [!CAUTION]
> Make sure to have localhost:8000 in the web instead of 127.0.0.1:8000 for authentication purposes.
