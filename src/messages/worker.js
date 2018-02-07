self.ws = null;
self.onmessage = (e) => {
	var messageCount = 0;
	var eventType = e.data[0];
	if (eventType == 'start') {
		var url = e.data[1];
		var maxMessageCount = -1;
		if (e.data.length > 2) {
			maxMessageCount = e.data[2];
		}
		self.ws = new WebSocket(url);
		self.ws.onmessage = (event) => {
			messageCount++;
			if (maxMessageCount != -1 && messageCount == maxMessageCount) {
				//self.ws.close();
				self.ws = null;
			}
			self.postMessage(event.data);
		};
	}
};
