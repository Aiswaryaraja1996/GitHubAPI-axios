import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

const Pagination = ({ totalPages, currentPage, onClickCallback }) => {
  const pages = new Array(totalPages).fill(0).map((a, i) =>
    i + 1 === currentPage ? (
      <button disabled style={{ background: "blue", color: "white" }} key={i}>
        {i + 1}
      </button>
    ) : (
      <button onClick={() => onClickCallback(i + 1)} key={i}>
        {i + 1}
      </button>
    )
  );
  return <div style={{ display: "flex", gap: "1rem",width: "55%", margin: "auto" }}>{pages}</div>;
};


const getUsers = ({ query = "masai", page=1 }) => {

  const config = {
    url : `https://api.github.com/search/users?q=${query}&page=${page}`,
    method :"GET"
  }
 
  return axios(config);
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);




  //mounting
  useEffect(() => {

    getUsers({page})
      .then((res) => {
        console.log(res.data.items);
        setData(res.data);
        console.log(data);
        if (res.data.total_count) {
          const total = Math.ceil(res.data.total_count / 20);
          setTotalPages(total);
        }
        setIsLoading(false);
      })
      .catch((err) => console.error(err));
      
  }, [page]);

  const handlePageChange = (value) => {
    console.log(value);
    setPage(value);
  };
 

  return (
    <div className="App">
      {isLoading ? (
        <h3>Loading !!</h3>
      ) : (
        <div style={{ width: "50%", margin: "auto" }}>
          {data.items.map((item) => (
            <div
              style={{
                border: "1px solid black",
                padding: "1rem",
                margin: "1rem",
              }}
            >
              <p>{item.login}</p>
              <p>{item.url}</p>
              <img width="150" src={item.avatar_url} alt={item.login} />
            </div>
          ))}
        </div>
      )}
      <Pagination 
       
        totalPages={totalPages}
        currentPage={page}
        onClickCallback={handlePageChange}
      ></Pagination>
    </div>
  );
}
