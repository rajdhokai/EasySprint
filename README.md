# EasySprint

A lightweight Jira-like task management app built using **Angular 20** and **localStorage**, with a beautiful Kanban drag-and-drop board and zero backend dependencies.


## 🚀 Features

- 🔐 **Local Authentication**
  - Signup / Login with localStorage
  - Session saved in localStorage as `currentUser`

- 📁 **Project Management**
  - Create / View / Edit / Delete projects
  - Project-specific task boards

- ✅ **Kanban Task Board**
  - Drag & Drop between To Do, In Progress, and Done
  - Status auto-updated on drop

- 🧠 **Task Details**
  - Title, description, due date
  - Assign to user (optional)

- 🧰 **Tech Stack**
  - Angular 20
  - Angular Material (or TailwindCSS)
  - @angular/cdk/drag-drop
  - localStorage for data persistence


## 📦 Folder Structure

```
src/app/
├── auth/           # Login & Signup
├── dashboard/      # User dashboard after login
├── projects/       # Project CRUD
├── tasks/          # Kanban board, task details
├── shared/         # Reusable components
└── core/           # Services, guards, interfaces
````


## 🛠️ Installation & Run

# 1. Clone the repo
```
git clone https://github.com/rajdhokai/EasySprint.git
```
# 2. Go to project folder
```
cd EasySprint
```
# 3. Install dependencies
```
npm install
```
# 4. Run the app
```
ng serve
```
Open `http://localhost:4200` in your browser.


## 🧪 Usage Tips

* First time? Click on "Signup" to create your local account.
* All your data (users, projects, tasks) is stored in `localStorage`.
* Works offline! ✅


## 📃 License

This project is open-source and free to use under the [MIT License](LICENSE).


## ✨ Credits

Made with ❤️ using Angular 20, by [Codebuster](https://github.com/rajdhokai)



