import React from "react";
import "./App.css";

const createImageView = (element) => {
	console.log(element);
	return (
		<div className="col-md-6 mt-1">
			<div className="card">
				<div className="card-body">
					<input type="radio" name="img-select" id="img-select" />&nbsp;&nbsp;&nbsp;
					<img src={element} alt="hello" style={{ width: '90%' }} />
				</div>
			</div>
		</div>
	)
}
export default class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isLoaded: false,
			imageList: [],
			selectedImage: null
		};
		this.emailInput = React.createRef();
	}
	handleSubmit = (event) => {
		event.preventDefault();
		if (this.emailInput.current.value) {
			const data = { emailId: this.emailInput.current.value };
			console.log(data);
			fetch("http://172.29.194.107:8443/api/fetchTickets", {
				method: 'POST',
				//mode: 'no-cors',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})
				.then(res => {
					if (res.ok)
						return res.json();
					else
						throw res.status;
				})
				.then(
					(result) => {
						this.setState({
							isLoaded: true,
							imageList: result
						});
					}
				).catch((error) => {
					alert('Sorry something went wrong.Please reload page and try again')
				});
		} else {
			alert("Please enter email address");
		}

	}

	handleSelection = (event) => {
		if (event.target.value !== undefined) {
			this.setState({
				selectedImage: event.target.value
			});
		}
	}

	handleDownloadClick = () => {
		const data = { emailId: this.emailInput.current.value, ticket: this.state.selectedImage };
		fetch("http://172.29.194.107:8443/api/saveTicket", {
			method: 'POST',
			//mode: 'no-cors',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
			.then(res => {
				if (res.ok) {
					document.getElementById("img-link").click();
				} else {
					throw res.status;
				}
			}).catch((error) => {
				alert('Sorry something went wrong.Please reload page and try again')
			});
		//window.open("/images/"+this.state.selectedImage.split('/')[4]);
	}

	render() {
		return (
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-12 text-center p-2 header-text">
						Tambola Tick-Pick
			 		</div>
				</div>
				<div className="row mt-1 p-2">
					<div className="col-md-12">
						<div className="card">
							<div className="card-body">
								<form onSubmit={this.handleSubmit} className="form-inline">
									<div className="form-group mx-sm-3 mb-2">
										<input type="text" className="form-control" id="input-email" ref={this.emailInput} placeholder="Enter Email Address" />
									</div>
									<button type="submit" className="btn btn-submit mb-2">Submit</button>
								</form>
							</div>
						</div>
					</div>
				</div>
				<div className="row mt-1 p-2">
					{this.state.isLoaded && (
						this.state.imageList.map((element) => {
							return (
								<div className="col-md-6 mt-1">
									<div className="card">
										<div className="card-body">
											<input type="radio" name="img-select" id="img-select" value={element} onChange={this.handleSelection} />&nbsp;&nbsp;&nbsp;
											<img src={`/images/${element}`} alt="hello" style={{ width: '90%' }} />
										</div>
									</div>
								</div>
							)
						})
					)}
					{this.state.isLoaded && this.state.selectedImage !== null && (
						<div className="col-md-12 text-right mt-2">
							<button type="button" className="btn btn-submit mb-2" onClick={this.handleDownloadClick}>Download Ticket</button>
							<a id="img-link" href={`/images/${this.state.selectedImage}`} download style={{visibility: "hidden"}}></a>
						</div>
					)}
				</div>
			</div>
		)
	}
}
