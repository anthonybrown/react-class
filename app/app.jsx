class Comment extends React.Component {
	render() {
		return (
			<div className='comment'>
				<div className='comment-body'>
					{this.props.children}
				</div>
				<div className='comment-author'>
					{this.props.author}
				</div>
			</div>
		)
	}
}

class CommentList extends React.Component {
	render() {
		var commentNodes = this.props.comments.map(function (comment) {
			return (
				<Comment key={comment.id} author={comment.author}>
					{comment.text}
				</Comment>
			)
		})

		return(
			<div className='comment-list'>
				{commentNodes}
			</div>
		)
	}
}

class CommentForm extends React.Component {
	handleSubmit(e) {
		e.preventDefault()
		var txt = document.querySelector('.txt');
		var author = React.findDOMNode(this.refs.author).value.trim()
		var text   = React.findDOMNode(this.refs.text).value.trim()
		var form   = React.findDOMNode(this.refs.form)
		// submit to server
		this.props.onSubmit({ author: author, text: text })

		form.reset()
		txt.focus()
	}

	render() {
		return(
			<form className='comment-form' ref='form' onSubmit={e => this.handleSubmit(e) }>
				<input className='txt' type='text' placeholder='Your name' ref='author' />
				<input type='text' placeholder='Say something...' ref='text' />
				<input type='submit' value='Add Comment' />
			</form>
		)
	}
}

class CommentBox extends React.Component {
		constructor(props) {
			super()
			this.state = {
				comments: props.comments || []
			}
		}

		loadDataFromServer() {
			$.ajax({
				url: this.props.url,
				dataType: 'json',
				success: function (comments) {
					this.setState({comments: comments})
				}.bind(this),
				error: function (xhr, status, err) {
					console.log(err.toString());
				}.bind(this)
			})
		}

		handleNewComment(comment) {
			var comments = this.state.comments
			var newComments = comments.concat([comment])
			this.setState({comments: newComments})

			$.ajax({
				url: this.props.url,
				type: 'POST',
				dataType: 'json',
				data: comment,
				success: function (comments) {
					this.setState({ comments: comments })
				}.bind(this),
				error: function (xhr, status, err) {
					console.log(err.toString());
				}.bind(this)
			})
		}

		componentDidMount() {
			this.loadDataFromServer()
			setInterval(this.loadDataFromServer.bind(this), 3000)
		}

	render() {
		return (
			<div className='comment-box'>
				<h1>Comments</h1>
				<CommentList  comments={this.state.comments} />
				<CommentForm onSubmit={ comment => this.handleNewComment(comment) } />
			</div>
		)
	}
}

myComponent = React.render(
	<CommentBox url='comments.json' />,
	document.querySelector('#content')
)
