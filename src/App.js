import React from 'react'
import { FaGithubAlt as GithubIcon } from 'react-icons/fa'
import { BsFillBriefcaseFill as PortfolioIcon } from 'react-icons/bs'
import { Accordion } from './components/Accordion/Accordion'
import { 
  nestedMenuData, 
  nestedAccordionData, 
  nestedAccordionDataOverrides 
} from './api/inputdata'
import {
  nestedDataClosure,
  nestedLayoutReducer,
  singlePeerExpansionReducer
} from './components/NestedAccordion/NestedAccordion'
import MenuDrawerApp from './components/MenuDrawerApp/MenuDrawerApp'
import './App.css'

function App() {
  return (
    <div className="appFrame">
      <header className="header" >
        <p className="headerTitle">Menu Drawer</p>
        <p className="headerSubTitle">Case Study</p>
        <p className="headerSubTitle">Transform an Accordion into a Menu Drawer</p>
      </header>
      <div className="grow1x" />
      <main className="main" >
        <article className="article" >
          <header className="articleTitle">Nested Accordion</header>
          <div className="accordion" >
            <Accordion
              items={nestedAccordionData}
              initialExpandedItems={[1]}
              inputItemsReducer={nestedDataClosure(nestedAccordionDataOverrides)}
              layoutReducer={nestedLayoutReducer}
              expansionReducer={singlePeerExpansionReducer}
            />
          </div>
        </article>
        <article className="article article2" >
          <MenuDrawerApp 
              items={nestedMenuData} 
              title="Menu Drawer"
              initialExpandedItems={[0, 1, 6]}
          />
        </article>
      </main>
      <div className="grow2x" />
      <footer className="footer" >
        <span>Incremental Industries &copy; 2020</span>
        <span className="grow1x"></span>
        <a
          className="footerButton"
          href="https://zenglenn42.github.io/portfolio"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="portfolio"
        >
          <PortfolioIcon />
        </a>
        <a
          className="footerButton"
          href="https://github.com/zenglenn42/menu-drawer/blob/master/README.md"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="github"
        >
          <GithubIcon />
        </a>
      </footer>
    </div>
  )
}

export default App
