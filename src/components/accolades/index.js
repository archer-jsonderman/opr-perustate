import React from "react"
import styled from "styled-components"
import Icon from '../../images/icons'
import './accolades.scss'


const ContentBox = styled.section`
	display:grid;
	background-color:${props=>props.theme.shade};
	margin:0 -1rem -1rem;
	padding:1rem;
`
const Headline = styled.h3`
	color:${props=>props.theme.brandblue}
`
const ItemsBox = styled.section`
	display:grid;
	grid-template:auto/100%;
	grid-auto-flow:row;
	justify-items:start;
	justify-content:start;
	width:90%;
	margin:0 auto;
	@media (min-width:768px){
		grid-template:1fr/1fr;
		grid-auto-flow:column;
		grid-auto-columns:1fr;
	}
`
const ItemStack = styled.div`
	display:grid;
	grid-template:75px 1fr/1fr;
	grid-column-gap:1rem;
	justify-items:center;
	align-items:center;
	max-width:none;
	width:100%;
	margin: 1rem auto;
	z-index:2;
	@media (max-width:768px){
		grid-template:1fr/75px 1fr;
		justify-items:center;
		margin:0;
	}
	.iconBox{
		grid-row:1/2;
		grid-column:1;
		width:130px;
		height:130px;
		align-content:center;
		justify-content:center;
		display:grid;
		grid-template:1fr/1fr;
		margin-bottom:.5rem;
		@media (max-width:768px){
			grid-row:1;
			grid-column:1/2;
			width:75px;
			height:75px;
		}
		svg{
			width:90%;
			height:90%;
			align-self:center;
			justify-self:center;
			grid-column:1;
			grid-row:1;
			}
	}
	p{
		color:black;
		font-size:1.5rem;
		font-weight: 800;
		grid-row:2/3;
		grid-column:1;
		text-align:center;
		justify-self:center;
		@media (max-width:768px){
			font-size:1.3rem;
			line-height:116%;
			grid-row:1;
			grid-column:2/3;
			text-align:left;
			justify-self:start;	
		}
	}
	
`
//need to pull the icon by name
const Items = (props) =>(
	<ItemsBox className="iconGrid">
		 {Object.keys(props).map((item, index)=>{
			 const text = props[item].content.tagline
			 return(
			 
				<ItemStack key={index} className="IconBox">
				<div className="iconBox">
					<Icon name={props[item].content.icon} />
				</div>
					<p dangerouslySetInnerHTML={{__html:text}}/>
				</ItemStack>
			)}
			)}
	</ItemsBox>
	)
export default class Accolades extends React.Component{
	
	render(){
		const {headline, items} = this.props
		return(
			<ContentBox key={this.props.index} clasName="accolades">
                <Headline dangerouslySetInnerHTML={{__html:headline}} className="accoladesHeadline"/>
				<Items {...items}/>
            </ContentBox>
			
		)
	}
}