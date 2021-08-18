import "./portfolio.scss";
import bazSite from "./img/portfolio/baztheroadie.webp";
import deanHome from "./img/portfolio/electdeanjohnson.webp";
import markHome from "./img/portfolio/mlhome.webp";
import deannaHome from "./img/portfolio/deannakeller.webp";
import maeBlake from "./img/portfolio/wedding.webp";
import soundHome from "./img/portfolio/soundMedical.webp";
import closeBlack from "../toolbar/img/close-black.svg";
import { useState } from "react";
import PortfolioImg from "./PortfolioImg";

export default function PortfolioItems() {
  const [item, setItem] = useState(0);
  const [animate, setAnimate] = useState("");
  const [enlarged, setEnlarged] = useState(null);
  const [portfolio, setPortfolio] = useState(0);
  const portfolioDetails = [
    {
      name: "My Wedding",
      site_home: maeBlake,
      site_landing: null,
    },
    {
      name: "Sound Medical",
      site_home: soundHome,
      site_landing: null,
    },
    {
      name: "Dean Johsnon",
      site_home: deanHome,
      site_landing: null,
    },
    {
      name: "Baz the Roadie",
      site_home: bazSite,
      site_landing: null,
    },
    {
      name: "Mark Lindquist",
      site_home: markHome,
      site_landing: null,
    },
    {
      name: "Deanna Keller",
      site_home: deannaHome,
      site_landing: null,
    },
  ];

  const handleClick = item => {
    setAnimate("animate");
    setTimeout(() => {
      setItem(item);
      setPortfolio(item);
      setAnimate("");
    }, 500);
  };

  const enlargeImage = img => {
    setEnlarged(img);
  };

  const togglePortfolio = direction => {
    const section = document.querySelector("#portfolio-items");
    const sectionChildrenWidth = section.getBoundingClientRect().width;

    let carouselPositions = [];
    document.querySelectorAll("#portfolio-items > div").forEach(function (div) {
      let child = div.getBoundingClientRect();
      carouselPositions.push([child.left]);
    });

    for (let i in carouselPositions) {
      if (carouselPositions[i] > -100 && carouselPositions[i] < 100) {
      }
    }
    const nextBefore = num => {
      const section = document.querySelector("#portfolio-items");
      section.scrollTo({
        left: num * sectionChildrenWidth,
        behavior: "smooth",
      });
    };

    const nextItem = () => {
      let portfolioCopy = portfolio;
      portfolioCopy++;
      if (portfolio === 6) {
        setItem(0);
        setPortfolio(0);
        nextBefore(0);
      } else {
        setItem(item + 1);
        setPortfolio(portfolioCopy);
        nextBefore(portfolioCopy);
      }
    };
    const beforeItem = () => {
      let portfolioCopy = portfolio;
      portfolioCopy--;
      if (portfolio === 0) {
        setPortfolio(6);
        nextBefore(6);
        setItem(6);
      } else {
        setPortfolio(portfolioCopy);
        nextBefore(portfolioCopy);
        setItem(item - 1);
      }
    };

    direction === "+" ? nextItem() : beforeItem();
  };

  const swipePortfolio = () => {
    let carouselPositions = [];
    document.querySelectorAll("#portfolio-items > div").forEach(function (div) {
      let child = div.getBoundingClientRect();
      carouselPositions.push([child.left]);
    });
    for (let i in carouselPositions) {
      if (carouselPositions[i] > -100 && carouselPositions[i] < 100) {
        setItem(parseInt(i));
        setPortfolio(parseInt(i));
      }
    }
  };

  window.addEventListener("load", () => {
    const portfolioSwipe = document.querySelector("#portfolio-items");
    portfolioSwipe.addEventListener("scroll", swipePortfolio, false);
  });

  return (
    <div className="portfolio">
      {enlarged === null ? (
        ""
      ) : (
        <div className="overlay">
          <img src={closeBlack} onClick={() => setEnlarged(null)} />
          <img src={enlarged} />
        </div>
      )}
      <div className="portfolio-sidenav">
        <ul>
          {portfolioDetails.map((obj, i) => (
            <li key={i} onClick={() => handleClick(i)}>
              <p className={item === i ? "active" : ""}>{obj.name}</p>
            </li>
          ))}
        </ul>
      </div>
      <div id="arrow" style={{ position: "relative" }}>
        <div onClick={() => togglePortfolio("+")} className="arrow right"></div>
        <div onClick={() => togglePortfolio("-")} className="arrow left"></div>
      </div>
      <div className="portfolio-details">
        {portfolioDetails
          .filter((obj, i) => i === item)
          .map(obj => (
            <div key={obj.name}>
              <div className={`portfolio-card ${animate}`}>
                <p className="portfolio-proj-title">{obj.name}</p>
              </div>
              <div className={`portfolio-site-img ${animate}`}>
                <PortfolioImg
                  imgIndex={1}
                  click={() => enlargeImage(obj.site_home)}
                  image={obj.site_home}
                />
              </div>
            </div>
          ))}
      </div>
      <div id="portfolio-items">
        {portfolioDetails.map((obj, i) => (
          <div key={obj.name}>
            <div className={`portfolio-card`}>
              <p className="portfolio-proj-title">{obj.name}</p>
            </div>
            <div className={`portfolio-site-img`}>
              <PortfolioImg
                imgIndex={i}
                click={() => enlargeImage(obj.site_home)}
                image={obj.site_home}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
