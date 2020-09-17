import React from "react"
import styled from "styled-components"
import './testimonial.scss'


const ContentBox = styled.section`
`
const Content = (props)=>{
	return <div className={props.className} dangerouslySetInnerHTML={{__html:props.content}}/>
}
const ImageBox = (props)=>(
	<div className={props.className}>{props.children}</div>
)
const Quote = ()=>(
<svg id="f4a4eeb1-666d-4870-8ae9-ad72dbaae5bf" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 450 450">
  <g>
    <path d="M263.52,364.43c-16.93,0-29.7-13.71-29.7-31.88a31.88,31.88,0,0,1,31.81-31.88,110.32,110.32,0,0,0,50.58-12.14c-46.17-10.23-80.8-51.3-80.8-100.26,0-56.63,45.58-102.7,101.6-102.7,56.35,0,100.49,45.09,100.49,102.64C437.5,285.39,359.45,364.42,263.52,364.43ZM365.1,273.6l-19.46,15.49a127.19,127.19,0,0,1-80,28.12,15.32,15.32,0,0,0-15.27,15.34c0,7.64,4.07,15.34,13.16,15.34,86.82,0,157.44-71.61,157.44-159.62,0-48.34-36.87-86.16-83.95-86.16-46.9,0-85.06,38.66-85.06,86.16s38.9,86.17,86.71,86.17l1.58-.08Z"/>
    <path d="M42.33,364.43c-17,0-29.83-13.71-29.83-31.88a31.88,31.88,0,0,1,31.82-31.88,110.39,110.39,0,0,0,50.59-12.14c-46.15-10.23-80.76-51.3-80.76-100.26,0-56.63,45.61-102.7,101.67-102.7,56.43,0,100.63,45.09,100.63,102.64C216.45,285.39,138.34,364.42,42.33,364.43Zm101.48-90.84-19.47,15.5a127.21,127.21,0,0,1-80,28.12A15.32,15.32,0,0,0,29,332.55c0,7.39,4.16,15.34,13.29,15.34,86.89,0,157.58-71.61,157.58-159.62,0-48.34-36.94-86.16-84.09-86.16-46.94,0-85.13,38.66-85.13,86.16s38.89,86.17,86.69,86.17l1.56-.08Z"/>
  </g>
</svg>
)

export default class Testimonial extends React.Component{
	
	render(){
		const {image, content} = this.props.testimonial||this.props;
		const HeadImage = (image && image.fields)?(
					<ImageBox className="testimonialarea-image-box">
						<img src={image.fields.file.en_US.url} alt="testimonial"/>
					</ImageBox>):(<Quote/>);
					
		return(
			<ContentBox className="testimonialarea">
				<div className="desktop-shim">
				
					{HeadImage}
	                <Content className="testimonialarea-content" content={content}/>
				</div>
			</ContentBox>
			
		)
	}
}