<%const total= []%>
			<%allReceipts.forEach(receipt => {%>
				<%total.push(receipt.amount)%>
			<% }) %>

		<%const addTotal = total.reduce((accumulator, current) => {
			const sum = accumulator + current
			return sum
			addTotal()
		})%>