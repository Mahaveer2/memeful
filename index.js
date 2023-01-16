import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const port = process.env.PORT || 8000
const app = express();

let memes = [];

app.get('/',(req,res) => {
  res.status(200).json("Welcome to memeful")
});

app.get('/memes',async (req,res) => {
  memes = [];
  try {
    const response = await axios.get("https://www.reddit.com/t/memes/");
    const $ = cheerio.load(response.data);
    const posts = $("div._1poyrkZ7g36PawDueRza-J");

    posts.each(function(){
      let title = $(this).find("._eYtD2XCVieq6emjKBH3m").text();
      let src = $(this).find("img._2_tDEnGMLxpM6uOa2kaDB3").attr("src");
      let author = $(this).find("a._2tbHP6ZydRpjI44J3syuqC").attr("href");

      if(src){
        let post = {
          author:author,
          title:title,
          src:src,
        };
        memes.push(post);
      }
    });
  } catch (error) {
    console.log(error);
  }
  return res.json(memes);
})

app.get('/memes/:subreddit', async (req,res) => {
  const subreddit = req.params.subreddit;

  try {
    const response = await axios.get(`https://www.reddit.com/r/${subreddit}/`);
    const $ = cheerio.load(response.data);
    console.log("feteched page")

    const posts = $("div._1poyrkZ7g36PawDueRza-J");

    posts.each(function(){
      let title = $(this).find("._eYtD2XCVieq6emjKBH3m").text();
      let src = $(this).find("img._2_tDEnGMLxpM6uOa2kaDB3").attr("src");
      let author = $(this).find("a._2tbHP6ZydRpjI44J3syuqC").attr("href");

      if(src){
        let post = {
          author:author,
          title:title,
          src:src,
        };
        memes.push(post);
      }
    });
  } catch (error) {
    console.log(error);
    }
    return res.json(memes);
})

app.listen(port,() => {
  console.log('listeneing on port ' + port);
})