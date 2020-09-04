import './App.css';

import React, { useState, useEffect } from 'react';
import logo from './Images/logo.PNG';
import Post from './Post';
import ImageUpload from './ImageUpload';
import { db, auth } from './Firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}
  
const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function App() {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [posts, setPosts] = useState([]);

    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(authUser => {
            if (authUser) {
                console.log(authUser);
                setUser(authUser);
            }
            else {
                setUser(null);
            }
        })

        return () => {
            unsubscribe();
        }
    }, [user, username]);

    // Run code every time a new post is added to Firebase
    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data()
            })));
        })
    }, []);

    const signUp = (event) => {
        event.preventDefault();

        auth.createUserWithEmailAndPassword(email, password)
        .then(authUser => {
            return authUser.user.updateProfile({
                displayName: username
            })
        })
        .catch(error => alert(error.message));

        setOpen(false);
    }

    const signIn = (event) => {
        event.preventDefault();

        auth.signInWithEmailAndPassword(email, password)
        .catch(error => alert(error.message));

        setOpenSignIn(false);
    }
    
    return (
        <div className="app">
            <Modal
                open={open}
                onClose={() => setOpen(false)}
            >
                <div style = {modalStyle} className = {classes.paper}>
                    <form className = "app_signup">
                        <center>
                            <img className = "app_headerImage"
                                    src = {logo}
                                    alt = ""
                            />
                        </center>

                        <Input placeholder = "username"
                                type = "text"
                                value = {username}
                                onChange = {(e) => setUsername(e.target.value)}
                        />

                        <Input placeholder = "email"
                                type = "text"
                                value = {email}
                                onChange = {(e) => setEmail(e.target.value)}
                        />

                        <Input placeholder = "password"
                                type = "password"
                                value = {password}
                                onChange = {(e) => setPassword(e.target.value)}
                        />

                        <Button type = "submit" onClick = {signUp}>Sign Up</Button>
                    </form>
                </div>
            </Modal>

            <Modal
                open={openSignIn}
                onClose={() => setOpenSignIn(false)}
            >
                <div style = {modalStyle} className = {classes.paper}>
                    <form className = "app_signup">
                        <center>
                            <img className = "app_headerImage"
                                    src = {logo}
                                    alt = ""
                            />
                        </center>

                        <Input placeholder = "email"
                                type = "text"
                                value = {email}
                                onChange = {(e) => setEmail(e.target.value)}
                        />

                        <Input placeholder = "password"
                                type = "password"
                                value = {password}
                                onChange = {(e) => setPassword(e.target.value)}
                        />

                        <Button type = "submit" onClick = {signIn}>Sign In</Button>
                    </form>
                </div>
            </Modal>

            <div className = "app_header">
                <img className = "app_headerImage" 
                        src = {logo} 
                        alt = ""
                />
                
                {user ? (
                    <Button onClick = {() => auth.signOut()}>
                        Sign Out
                    </Button>
                    ) : (
                    <div className = "app_loginContainer">
                        <Button onClick = {() => setOpenSignIn(true)}>
                            Sign In
                        </Button>
                        <Button onClick = {() => setOpen(true)}>
                            Sign Up
                        </Button>
                    </div>
                )}
            </div>

            <div classname = "app_posts">
                {
                    posts.map(({id, post}) => (
                        <Post key = {id} postId = {id} user = {user} username = {post.username} caption = {post.caption} imageUrl = {post.imageUrl} />
                    ))
                }
            </div>

            {user?.displayName ? (
                <ImageUpload username = {user.displayName} />
            ) : (
                <h3> Login to upload</h3>
            )}
        </div>
    );
}

export default App;
