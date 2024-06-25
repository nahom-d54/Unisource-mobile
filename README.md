
# Unisource

Welcome to the Unisource Mobile App for Adama Science and Technology University students. This app provides essential services to enhance your campus experience, from downloading course materials to accessing university resources.


## Documentation

- [@Documentation](https://docs.google.com/document/d/1A8CBoCcUSeQFpAvRodwlSH-Zlh6h3a5G0lrkf7H-SlU/edit)



## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Installation](#installation)
4. [Usage](#usage)
5. [File Management](#file-management)
6. [Contributing](#contributing)
7. [License](#license)
8. [Contact](#contact)

## Features

- **User Authentication**: Secure sign-in and sign-up functionality.
- **File Download Management**: Download, view, and manage course materials and other university resources.
- **Guest Access**: Explore the app without signing in.
- **Persistent Storage**: Save and retrieve your file download history.
- **File Operations**: Open, save, and delete downloaded files.
- **User-Friendly Interface**: Intuitive and responsive design.

## Tech Stack

### Frontend

- **React Native**: For building the mobile application.
- **Expo**: For easier development and testing of the React Native app.
- **React Native Paper**: For UI components.

### Backend

- **Django Rest Framework**: For building the API.
- **Supabase**: For user authentication and real-time database operations.
- **PostgreSQL**: For the database.

### Storage

- **React Native Async Storage**: For local storage of downloaded files and user preferences.


## Installation

To get started with the Unisource Mobile App, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/nahom-d54/unisource-mobile
   cd unisource-mobile

2. **Install Dependencies**:
    ```bash
    npm install expo
    npx expo install
3. **Run app**:
    ```bash
    npx expo start

## Backend Setup

1. **Clone the Backend Repository**:

```bash
git clone https://github.com/nahom-d54/unisource
cd unisource
```
2. **Set Up Virtual Environment**:
```bash
python3 -m venv env
source env/bin/activate
```
3. **Install Backend Dependencies**:
```bash
pip install -r requirements.txt
```
4. **Run Migrations**:
```bash
python manage.py migrate
```
5. **Start the Backend Server**:
```bash
python manage.py runserver
```




## Usage
**Root Layout**:
The RootLayout component manages the app's navigation using a stack navigator. It includes screens for index, downloaded files, authentication, and detailed views.

**Downloaded Files Component**:
The downloadedFiles component handles the display and management of downloaded files. It allows users to view, open, save, and delete files, with persistent storage for file history.

**App Component**:
The App component manages the initial app state and navigation. It includes options for signing in, signing up, and continuing as a guest.

**File Management**:
The app provides various functionalities to manage your downloaded files:

View Files: Open downloaded files directly from the app.
Save Files: Save downloaded files to the device storage.
Delete Files: Delete individual files or clear the entire download history.


## Authors

- [@Nahom](https://www.github.com/nahom-d54)
- [@Daniel](https://www.github.com/danielbizualem)
- [@Hana](https://www.github.com/annah11)
- [@Misgana](https://www.github.com/misge1st)
- [@Eliyas](https://www.github.com/eliyas47)
- [@Naol](https://www.github.com/naol86)


