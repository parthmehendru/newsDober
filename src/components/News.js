import React from 'react'
import { useEffect, useState } from 'react';
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';


const  News = (props)=> {
 
    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const capitalizeFirstLetter = (string) =>{
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    
    

    const updateNews = async()=>{
      props.setProgress(10)
      let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=c1a5ce2291a64f0a9e50ac9e3d0bc0f8&page=${page}&pageSize=${props.pageSize}`
      let data = await fetch(url);
      props.setProgress(30)
      let parsedData = await data.json();
      props.setProgress(70);
      // console.log(parsedData);
      setArticles(parsedData.articles);
      setTotalResults(parsedData.totalResults)
      props.setProgress(100);
      setHasMore(parsedData.articles.length < parsedData.totalResults);
    }

    useEffect(()=> {
      document.title = `${capitalizeFirstLetter(props.category)} - NewsDober`;
      updateNews();
      // eslint-disable-next-line
    }, [props.category])
    

    // const handleNextClick = async()=> {
      // setPage(page+1);
    //   updateNews();
      
    // }

    // const handlePrevClick = async()=> {
      
      // setPage(page-1);
      //   updateNews();
    // }

    const fetchMoreData = async() => {
      
      let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=c1a5ce2291a64f0a9e50ac9e3d0bc0f8&page=${page+1}&pageSize=${props.pageSize}`
      setPage(page+1);
      let data = await fetch(url);
      let parsedData = await data.json();
      // console.log(parsedData);
      
      setArticles((prevArticles) => prevArticles.concat(parsedData.articles));
      setHasMore(articles.length + parsedData.articles.length < parsedData.totalResults);
     
      
    }
    return (
      <>
        <h2 className='text-center' style={{margin: '35px 0px', marginTop: '90px'}}>NewsDober - Top Headlines on {capitalizeFirstLetter(props.category)}</h2>
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<Spinner />}
        >
          <div className="container">
            <div className='row'>
            {/*!loading && */ articles.map((element)=>(
                <div key={element.url} className='col-md-4'>
                    <NewsItem title={element.title?element.title:""} description={element.description?element.description:""} imageUrl={element.urlToImage} newsUrl = {element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                </div>
            ))}
            </div>
          </div>
        </InfiniteScroll>


      </>
    )
  
}
News.defaultProps = {
  country: 'in',
  pageSize: 8,
  category: "general"
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

export default News
