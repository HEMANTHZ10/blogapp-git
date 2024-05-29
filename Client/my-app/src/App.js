import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'
import './App.css';
import Routee from '../src/Routee/Routee'
import {lazy, Suspense} from 'react'
import Home from './components/Home/Home';
import Signup from './components/Signup/Signup';
import Signin from "./components/Signin/Signin";

import UserProfile from './components/user-profile/UserProfile';
import AuthorProfile from './components/author-profile/AuthorProfile'
import Articles from './components/articles/Articles';


//import AddArticle from './components/add-article/AddArticle';
import ArticlesByAuthor from './components/articles-by-author/ArticlesByAuthor';
import Article from './components/article/Article';


import ErrorPage from './components/ErrorPage';
//dynamic import of Articles
//const Articles=lazy(()=>import('./components/articles/Articles'))
const AddArticle=lazy(()=>import('./components/add-article/AddArticle'))
function App() {

  const browseRouter=createBrowserRouter([{
    path:'',
    element:<Routee />,
    errorElement:<ErrorPage />,
    children:[
      {
        path:'',
        element:<Home />
      },
      {
        path:'/signup',
        element:<Signup />
      },
      {
        path:"/signin",
        element:<Signin />
      },
      {
        path:"/user-profile",
        element:<UserProfile />,
        children:[
          {
            path:"articles",
            element:<Articles />
          },
          {
            path:"article/:articleId",
            element:<Article />
          },
          {
            path:'',
            element:<Navigate to='articles' />
          }
        ]
      },
      {
        path:"/author-profile",
        element:<AuthorProfile />,
        children:[
          {
            path:'new-article',
            element:<Suspense fallback="loading..."><AddArticle /></Suspense> 
          },
          {
            path:'articles-by-author/:author',
            element:<ArticlesByAuthor />,
           
          },
          {
            path:"article/:articleId",
            element:<Article />
          },
          {
            path:'',
            element:<Navigate to='articles-by-author/:author' />
          }
        ]
      }
    ]
  }])

  return (
    <div>
      <RouterProvider router={browseRouter} />
    </div>
  );
}

export default App;