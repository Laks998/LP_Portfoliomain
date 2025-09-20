// Create animated neural network background
function createNeuralNetwork() {
  const network = document.getElementById('neural-network');
  const nodeCount = 20;
  
  for (let i = 0; i < nodeCount; i++) {
    const node = document.createElement('div');
    node.className = 'node';
    node.style.left = Math.random() * 100 + '%';
    node.style.top = Math.random() * 100 + '%';
    node.style.animationDelay = Math.random() * 3 + 's';
    network.appendChild(node);
    
    // Create connections
    if (i < nodeCount - 1) {
      const connection = document.createElement('div');
      connection.className = 'connection';
      connection.style.left = Math.random() * 100 + '%';
      connection.style.top = Math.random() * 100 + '%';
      connection.style.width = Math.random() * 200 + 50 + 'px';
      connection.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      connection.style.animationDelay = Math.random() * 4 + 's';
      network.appendChild(connection);
    }
  }
}

