# Online Wallet 💳

A secure financial system that enables users to perform transactions such as peer-to-peer transfers, company payments, and wallet charging via authorized points. Features robust role-based access control (RBAC) for secure management.

---

## ✨ Key Features
- **Transfers**: Send funds directly between users.
- **Company Payments**: Pay service providers using your wallet balance.
- **Wallet Charging**: Top up your balance via authorized charging points.
- **Role-Based Access Control**: Granular permissions for different user roles.

---

## 👥 User Roles
| Role             | Capabilities                               |
|------------------|--------------------------------------------|
| **User**         | Transfer funds, pay companies              |
| **Charging Point**| Charge user wallets                       |
| **System Owner** | Monitor system, manage charging points     |
| **Admin**        | Full system control, manage roles and users|
| **Company**        | Receive money paid by the user|


---

## 🛠 Tech Stack
| Component        | Technologies Used                          |
|------------------|--------------------------------------------|
| **Backend**      | Node.js, Express.js, REST API              |
| **Database**     | MySQL, Sequelize ORM                       |
| **Authentication**| JWT, Bcrypt              |

---


## ⚡ Local Setup
### Prerequisites:
- Node.js (v16+)
- MySQL (v8+)
- NPM/Yarn

### Installation Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/online-wallet.git
   cd online-wallet

 2. Install Dependencies:
    ```bash
    npm install

4. Add Required Env Variables
   ```bash
create .env file in the root folder, fill it according to .env.example file.

6. Running
   ```bash
npm start    
