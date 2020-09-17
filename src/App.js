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
import {
  appFrame,
  header,
  headerTitle,
  headerSubTitle,
  main,
  article,
  article2,
  articleTitle,
  accordion,
  footer,
  iconButton,
  grow,
  grow2x
} from './style.js'
import MenuDrawerApp from './components/MenuDrawerApp/MenuDrawerApp'

function App() {
  return (
    <>
      <div style={appFrame}>
        <header style={header}>
          <p style={headerTitle}>Menu Drawer</p>
          <p style={headerSubTitle}>Case Study</p>
          <p style={headerSubTitle}>Transform an Accordion into a Menu Drawer</p>
        </header>
        <div style={grow} />
        <main style={main}>
          <article style={article}>
            <header style={articleTitle}>Nested Accordion</header>
            <div style={accordion}>
              <Accordion
                items={nestedAccordionData}
                initialExpandedItems={[1]}
                inputItemsReducer={nestedDataClosure(nestedAccordionDataOverrides)}
                layoutReducer={nestedLayoutReducer}
                expansionReducer={singlePeerExpansionReducer}
              />
            </div>
          </article>
          <article style={article2}>
            <MenuDrawerApp 
                items={nestedMenuData} 
                title="Menu Drawer"
                initialExpandedItems={[0, 1, 6]}
            />
          </article>
        </main>
        <div style={grow2x} />
        <footer style={footer}>
          <span>Incremental Industries &copy; 2020</span>
          <span style={{ flex: 1 }}></span>
          <a
            style={iconButton}
            href="https://zenglenn42.github.io/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="portfolio"
          >
            <PortfolioIcon />
          </a>
          <a
            style={iconButton}
            href="https://github.com/zenglenn42/menu-drawer/blob/master/README.md"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="github"
          >
            <GithubIcon />
          </a>
        </footer>
      </div>
    </>
  )
}

export default App
