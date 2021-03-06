import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
//import queryString from 'query-string'

import Layout from "../components/singleprogramlayout"


export default ({data, location}) => {
//parse pararmeters for cofingruation. console.log(queryString.parse(location.search),' master')
	return (
		<>
			<Helmet>
			  <meta charSet="utf-8" />
			  <title>{
				  (data.contentfulSingleProgramLandingPage.metaTitle)?
				  	data.contentfulSingleProgramLandingPage.metaTitle:
				  	data.contentfulSingleProgramLandingPage.heroArea.headline.replace(/(<([/fp]+)>)/ig,"")
				  	}
				</title>
			  <meta name="robots" content="noindex, nofollow"/>
			  <meta name="facebook-domain-verification" content="09l1oqph57rjeekolpkqriye9km9na"/>
			  <link rel="shortcut icon" href="https://www.peru.edu/favicon.ico"/>
			</Helmet>
			<Layout
			{...data.contentfulSingleProgramLandingPage}
			programs={data.allContentfulProgramInfo}
			location={location}
			/>
	    </>

  )
}


export const query = graphql`
	query singleprogramquery($slug: String){	
		contentfulSingleProgramLandingPage(slug: { eq: $slug }) {
		  pageName
		  metaTitle
	      slug
	      callout{
				content{
					icon
					message
					display
				}
			}
	      heroArea {
	        headline
	        subHeadline
	        itemsType
	        bullets
	        items{
		        content{
			        icon
			        tagline
			        }
			    }
	        image {
	          fields {
	            file {
	              en_US {
	                url
	              }
	            }
	          }
	        }
	      }
	      programContent {
		    id
		    contentful_id
		    programCode
		    pageName
            programDetails {
              headline
              content
            }
            programInfo {
              items {
                content {
                  icon
                  tagline
                }
              }
            }
            careerOpportunities {
              headline
              content
            }
            applyBy
            startClasses
          }
	      accolades {
	        items {
	          content {
	            icon
	            tagline
	          }
	        }
	        headline
	      }
	      testimonial {
		      
	        testimonial {
		        image {
	                fields {
	                  file {
	                    en_US {
	                      url
	                    }
	                  }
	                }
	            }
				content
	        }
	      }
	      awards {
	        headline
	        items {
	          content {
	            image {
	              fields {
	                file {
	                  en_US {
	                    url
	                  }
	                }
	              }
	            }
	          }
	        }
	      }
	      bottomContentSection {
	        headline
	        content
	      }
	      formSettings {
            headline
            subheadline
            successMsg
            redirect
            redirectUrl
            phone
          }
	  	video_id
			
		}
		allContentfulProgramInfo {
			nodes{
					id
					contentful_id
			        shortName
			        pageName
			        programCode
			        pageSlug
			        applyBy
		            startClasses
			    }
		   
		  }
	}  
`