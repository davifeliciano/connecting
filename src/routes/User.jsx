import styled, { useTheme } from "styled-components";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AiOutlinePlus } from "react-icons/ai";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import PostCard from "../components/PostCard.jsx";
import SideBar from "../components/SideBar.jsx";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import UserCard from "../components/UserCard.jsx";

export default function User() {
  const theme = useTheme();
  const { username } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [outOfPosts, setOutOfPosts] = useState(false);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const userPromise = axiosPrivate.get(`/users/${username}`);
        const postsPromise = axiosPrivate.get(`/posts?author=${username}`);

        const [userResponse, postsResponse] = await Promise.all([
          userPromise,
          postsPromise,
        ]);

        setUser(userResponse.data);
        setPosts(postsResponse.data);
      } catch (err) {
        console.error(err);
        navigate("/login?reason=denied", {
          state: { from: location },
          replace: true,
        });
      }
    };

    getData();
  }, []);

  return (
    <PageContainer>
      <FeedContainer>
        {user ? (
          <UserCard user={user} />
        ) : (
          <Skeleton
            height={300}
            count={1}
            borderRadius={5}
            highlightColor={theme.skeletonLoaderMain}
          />
        )}
        {posts.length !== 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <Skeleton
            height={600}
            count={1}
            borderRadius={5}
            highlightColor={theme.skeletonLoaderMain}
          />
        )}
        <LoadMorePostsButton>
          {loadingMorePosts ? <SubmitLoader /> : "Load More Posts"}
        </LoadMorePostsButton>
      </FeedContainer>
      <SideBar />
      <Link to="/new">
        <NewPostButton>
          <AiOutlinePlus />
        </NewPostButton>
      </Link>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 5rem;
`;

const FeedContainer = styled.main`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 60rem;
`;

const LoadMorePostsButton = styled.button`
  width: 100%;
  height: 4.5rem;
  color: ${(props) => props.theme.contentBackground};
  background-color: ${(props) => props.theme.secondary};
  filter: drop-shadow(2px 2px 5px ${(props) => props.theme.secondary});
  border: none;
  border-radius: 5px;
  font-family: "Poppins", sans-serif;
  font-size: 2rem;
  transition: background-color 200ms ease;

  &:active {
    background-color: ${(props) => props.theme.main};
    transition: background-color 200ms ease;
  }

  &:disabled {
    opacity: 70%;
  }

  & svg {
    margin: auto;
  }
`;

const NewPostButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 6rem;
  aspect-ratio: 1 / 1;
  border: none;
  border-radius: 100%;
  color: ${(props) => props.theme.contentBackground};
  background-color: ${(props) => props.theme.secondary};
  filter: drop-shadow(2px 2px 5px ${(props) => props.theme.secondary});

  transition: background-color 200ms ease;

  position: fixed;
  right: 5rem;
  bottom: 5rem;

  &:active {
    background-color: ${(props) => props.theme.main};
    transition: background-color 200ms ease;
  }

  & svg {
    width: 4rem;
    height: 4rem;
  }
`;
