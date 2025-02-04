import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../src/context/AuthContext";

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useSignup = () => {

    const [loading, setLoading] = useState(false);

    const {setAuthUser} = useAuthContext();

    const signup = async ({ fullname, username, password, confirmPassword, gender }) => {
        const success = handleInputErrors({ fullname, username, password, confirmPassword, gender });
        if (!success) return;

        setLoading(true);
        // setLoading is used to show the loading spinner when the user clicks the signup button
        try {

            // await delay(2000); // this is used to delay the execution of the code by 2 seconds so that we can see the loading spinner

            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({
                    fullname,
                    username,
                    password,
                    confirmPassword,
                    gender
                }), //converts the object to a JSON string
            });

            const data = await res.json();
            // we got a CORS error because we are trying to access the API from a different origin so we need to add a proxy to the vite.config.js file not the package.json file because we are using vite not create-react-app
            // we need to fix this only in client side not in the server side so that we can access the API from the client side only

            // if(data.error) {
            //     toast.error(data.error); // thrown new Error() will make the catch block run
            // }

            console.log(data);

            // localstorage
            localStorage.setItem("chat-user", JSON.stringify(data));// this will store the user data in the localstorage of the browser so that the user remains logged in even after the page is refreshed

            // toast.success("User signed up successfully");
            
            // context
            setAuthUser(data); // this will set the user data in the context so that the user remains logged in even after the page is refreshed

        } catch (error) {
            console.log("Error in signup controller : ",error.message);
            toast.error(error.message);
        } finally {
            setLoading(false); // here setLoading is set to false to hide the loading spinner
        }
    }
    function handleInputErrors({ fullname, username, password, confirmPassword, gender}) {
        if (!fullname || !username || !password || !confirmPassword || !gender) {
            toast.error("All fields are required");
            // return { error: "All fields are required" };
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Password and Confirm Password do not match");
            // return { error: "Password and Confirm Password do not match" };
            return false;
        }
        
        if(password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            // return { error: "Password must be at least 6 characters long" };
            return false;
        }
        return true;
    }
    return { signup, loading };
}   