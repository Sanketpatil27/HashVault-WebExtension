// class VaultService
// {
//     static STORAGE_KEY = "hashvault_passwords";

//     static getPasswords()
//     {
//         let passwords =
//             JSON.parse(
//                 localStorage.getItem(
//                     this.STORAGE_KEY
//                 )
//             );

//         if(!passwords)
//         {
//             passwords =
//             [
//                 {
//                     id: 1,
//                     website: "github.com",
//                     username: "sanket@gmail.com",
//                     password: "Github123",
//                     notes: "Github Account"
//                 },

//                 {
//                     id: 2,
//                     website: "linkedin.com",
//                     username: "work@gmail.com",
//                     password: "LinkedIn123",
//                     notes: "LinkedIn Account"
//                 },

//                 {
//                     id: 3,
//                     website: "gmail.com",
//                     username: "sanket@gmail.com",
//                     password: "Gmail123",
//                     notes: "Personal Mail"
//                 }
//             ];

//             this.savePasswords(
//                 passwords
//             );
//         }

//         return passwords;
//     }

//     static savePasswords(passwords)
//     {
//         localStorage.setItem(
//             this.STORAGE_KEY,
//             JSON.stringify(passwords)
//         );
//     }

//     static getPasswordById(id)
//     {
//         return this
//             .getPasswords()
//             .find(password =>
//                 password.id === id
//             );
//     }

//     static getCredentialBySite(site)
//     {
//         return this
//             .getPasswords()
//             .find(password =>
//                 password.website
//                     .toLowerCase() ===
//                 site
//                     .toLowerCase()
//             );
//     }

//     static addPassword(
//         website,
//         username,
//         password,
//         notes
//     )
//     {
//         const passwords =
//             this.getPasswords();

//         const newPassword =
//         {
//             id: Date.now(),

//             website,
//             username,
//             password,
//             notes
//         };

//         passwords.push(
//             newPassword
//         );

//         this.savePasswords(
//             passwords
//         );
//     }

//     static updatePassword(
//         id,
//         website,
//         username,
//         password,
//         notes
//     )
//     {
//         const passwords =
//             this.getPasswords();

//         const index =
//             passwords.findIndex(
//                 p => p.id === id
//             );

//         if(index === -1)
//             return;

//         passwords[index] =
//         {
//             id,

//             website,
//             username,
//             password,
//             notes
//         };

//         this.savePasswords(
//             passwords
//         );
//     }

//     static deletePassword(id)
//     {
//         let passwords =
//             this.getPasswords();

//         passwords =
//             passwords.filter(
//                 password =>
//                     password.id !== id
//             );

//         this.savePasswords(
//             passwords
//         );
//     }
// }