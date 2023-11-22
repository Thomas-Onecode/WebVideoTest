import { collection, doc, getDoc, getDocs, updateDoc, deleteDoc, addDoc, collectionGroup, query, orderBy } from "firebase/firestore"; 
import {httpsCallable } from "firebase/functions";
import { auth, db, fun, storage } from "./firebaseSetUp"
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, getDownloadURL } from "firebase/storage";

async function getCompany(companyID) {
    return (await getDoc(doc(db, "companies", companyID))).data();
}

async function getEmployees(companyID) {
    return await getDocs(collection(db, "companies", companyID, "employees"));
}

async function updateEmployee(companyID, employeeID, toUpdate) {  // doesn't work
    const docRef = doc(db, "companies", companyID, "employees", employeeID);
    await updateDoc(docRef, toUpdate);
}

async function deleteEmployee(companyID, employeeID, toUpdate) {
    const docRef = (doc(db, "companies", companyID, "employees", employeeID));
    await deleteDoc(docRef, toUpdate);
}

async function getCustomers(companyID) {
    return await getDocs(collection(db, "companies", companyID, "customers"));
}

async function createCustomer(companyID, toCreate) {
    return await addDoc(collection(db, "companies", companyID, "customers"), toCreate);
}

async function updateCustomer(companyID, customerID, toUpdate) {
    return await updateDoc(doc(db, "companies", companyID, "customers", customerID), toUpdate);
}

async function getHistoryOfCustomer(companyID, customerID) {
    return await getDocs(collection(db, "companies", companyID, "customers", customerID, "history")).data();
}

async function getHistory(companyID) {     
    return await getDocs(query(collectionGroup(db, 'history') , orderBy("createdTimestamp", "desc"))).data();
}

async function signUp(firstName, lastName, phoneNumber, email, password, companyID) {     
    const signUpCallable = httpsCallable(fun, 'signUp');
    return await signUpCallable({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        email: email,
        password: password,
        companyID: companyID
    })
}

async function login(email, password) {
    return await signInWithEmailAndPassword(auth, email, password);
}


// also needs auth
async function uploadVideo(file, companyID, customerID) {    
    const uploadVideoCallable = httpsCallable(fun, 'uploadVideo');
    return await uploadVideoCallable({
        file: file,
        companyID: companyID,
        customerID: customerID
    })
}

async function getDownloadURLToVideo(path) {    
    try {
        const fileRef = ref(storage, path);
        return await getDownloadURL(fileRef);
      } catch (error) {
        console.error('Error getting download URL:', error);
        return null; // or handle the error as needed
      }
}



export {getCompany, getEmployees, updateEmployee, deleteEmployee, getCustomers, createCustomer, updateCustomer, getHistoryOfCustomer, getHistory, signUp, uploadVideo, login, getDownloadURLToVideo}