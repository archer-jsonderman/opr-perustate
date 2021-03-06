const Promise = require('bluebird')
const path = require('path')
var slugify = require('slugify')

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    node: {
      fs: 'empty'
    }
  })
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  const tabbedPage = path.resolve('./src/pages/tabbedlandingpage.js')
  const singleProgram = path.resolve('./src/pages/singleprogram.js')
  const transferPage = path.resolve('./src/pages/transferpage.js')
  return new Promise((resolve, reject) => {
    
    resolve(
      graphql(
        `
          {
            allContentfulNestedTabbedLandingPage {
		      edges {
		        node {
		          slug
		          id
		        }
		      }
		    } 
		    allContentfulSingleProgramLandingPage {
			    edges {
			      node {
			        id
			        contentful_id
			        slug
			      }
			    }
			  }
			allContentfulNonProgramPage{
				nodes{
					id
					contentful_id
					slug
				}
			}           
		  }
		  
          `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors,' Node Errors')
          reject(result.errors)
        }
		//do this for each type of page... partnerpages, NestedTabbed, Tabbed, ProgramPages
		//this will create pages with each template 
		result.data.allContentfulNestedTabbedLandingPage.edges.forEach((edge) => {
			createPage({
				path: `/lp/${edge.node.slug}/`,
				component: tabbedPage,
				context:{
					slug: edge.node.slug
				}
			})
        })
        result.data.allContentfulSingleProgramLandingPage.edges.forEach((edge) => {
			createPage({
				path: `/lp/${edge.node.slug}/`,
				component: singleProgram,
				context:{
					slug: edge.node.slug
				}
			})
        })
        //transfer students landing page
         result.data.allContentfulNonProgramPage.nodes.forEach((node) => {
			createPage({
				path: `/lp/${node.slug}/`,
				component: transferPage,
				context:{
					slug: node.slug
				}
			})
        })
       
      })
    )
  })
}