import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Loader from "../components/Loader";
import Card from '../components/Card.jsx';

const Community = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter((item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchedResults(searchResult);
      }, 100)
    );
  };

  const fetchPosts = async () => {
    setLoading(true);

    try {
      const response = await axios.get('http://localhost:8000/api/v1/post', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setAllPosts(response.data.data.reverse());
        setSearchedResults(response.data.data.reverse());  // Initialize search results with all posts
      } else {
        console.log(response);
        console.log("Error in fetching posts");
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <Navbar btnText="Create" />

      <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-semibold mb-4">The Community Showcase</h2>

        <div className="mb-6 flex items-center space-x-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search Posts
          </label>
          <input
            type="text"
            id="search"
            name="search"
            value={searchText}
            onChange={handleSearchChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search"
          />
        </div>

        {loading ? (
          <div><Loader/></div>
        ) : (
          <div>
            {searchedResults.map((post, index) => (
              <div key={index}>
                {/* Render your posts here */}
                <Card id={post._id} name={post.name} model={post.model} prompt={post.prompt} image={post.photo}/>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Community;
