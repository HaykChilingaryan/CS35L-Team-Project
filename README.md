# CS35L-Team-Project
## Taskify

Taskify is a Task Management website where managers of the companies can register users, assign tasks to them, track the progress of those and view schedule view of the tasks. Regular users can view the tasks assigned to them and updatre their statuses if those are changed.

## Key Features

 * User Authentication 
   * Registration - Users get an email once their manager registers them to Taskify, which includes credentials
   * Login - Using credentials provided in the email
   * Logout - Finish user session
 * Task creation/deletion, assiginment to users, status update
 * Schedule view of tasks, showing dates when users have tasks due
 * Searching between the user tasks by the title or description
 * Sorting tasks in
   * Title order
   * Due date order
   * Assignee Name order
 * Profile view
   * User information
   * Password change

## Running the Application

> [!NOTE]
> Because the application is standalone application all the secret keys are hardcoded. Please be cautious while using the application.

```
git clone https://github.com/HaykChilingaryan/CS35L-Team-Project.git
```

### Frontend

After the installation of neccessary packages the frontend will run on port localhost:3000

```
cd CS35L-Team-Project
cd taskify
cd frontend
npm install
npm run dev
```

### Backend

After the installation of neccessary packages backend will run on port localhost:8000

```
cd CS35L-Team-Project
cd taskify
pip install -r requirements.txt
python ./manage.py runserver localhost:8000
```
> [!IMPORTANT]
> If there is any issue with running the backend and frontend applications please Email to haykchilingaryan2002@gmail.com.

Once both frontend and backend are up, the application will be hosted on localhost:8000

> [!CAUTION]
> Make sure to have localhost:8000 in the web instead of 127.0.0.1:8000.


