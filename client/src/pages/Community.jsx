import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Card from "../components/Card.jsx";

const Community = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
            item.prompt.toLowerCase().includes(e.target.value.toLowerCase()) ||
            item.model.toLowerCase().includes(e.target.value.toLowerCase())
        );
        setSearchedResults(searchResult);
      }, 100)
    );
  };

  const fetchPosts = async () => {
    setLoading(true);

    try {
      const response = await axios.get("http://localhost:8000/api/v1/post", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const posts = response.data.data.reverse();
        setAllPosts(posts);
        setSearchedResults(posts);
      } else {
        console.log(response);
        console.log("Error in fetching posts");
      }
    } catch (err) {
      alert("Error in fetching posts");
      console.log(err);
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

      <div className="bg-black pb-[16vh] mx-auto min-h-screen">
        <h2 className="text-2xl font-semibold mb-4 text-white">
          The Community Showcase
        </h2>

        {/* Search input field */}
        <div className="mb-10 flex flex-col items-start px-6">
          <input
            type="text"
            id="search"
            name="search"
            value={searchText}
            autoComplete="off"
            onChange={handleSearchChange}
            className="mt-1 block w-[90%] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search by name, model, or prompt"
          />
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader />
          </div>
        ) : (
          <div className="p-6 flex flex-wrap gap-6 w-full items-center justify-center">
            {searchText ? (
              searchedResults.length > 0 ? (
                searchedResults.map((post, index) => (
                  <div className="bg-black" key={index}>
                    {/* Render your posts here */}
                    <Card
                      id={post._id}
                      name={post.name}
                      model={post.model}
                      prompt={post.prompt}
                      image={post.photo}
                    />
                  </div>
                ))
              ) : (
                <div className="bg-black text-white p-6 text-center w-full">
                  No Posts Found
                </div>
              )
            ) : (
              allPosts.map((post, index) => (
                <div className="bg-black" key={index}>
                  {/* Render your posts here */}
                  <Card
                    id={post._id}
                    name={post.name}
                    model={post.model}
                    prompt={post.prompt}
                    image={post.photo}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Community;
