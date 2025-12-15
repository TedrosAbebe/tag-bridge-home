const http = require('http');

async function createBrokerUsers() {
    console.log('🏢 Creating Broker Users...\n');
    
    const brokerUsers = [
        { username: 'broker1', password: 'broker123', role: 'broker' },
        { username: 'broker2', password: 'broker123', role: 'broker' }
    ];
    
    for (const userData of brokerUsers) {
        console.log(`📝 Creating broker user: ${userData.username}...`);
        await registerUser(userData.username, userData.password, userData.role);
    }
    
    console.log('\n✅ Broker users creation completed!');
}

async function registerUser(username, password, role) {
    return new Promise((resolve) => {
        const postData = JSON.stringify({
            username: username,
            password: password,
            role: role
        });
        
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: '/api/auth/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.success || result.user) {
                        console.log(`   ✅ ${username} (${role}) created successfully`);
                    } else {
                        console.log(`   ❌ ${username} creation failed:`, result.error || result.message);
                    }
                } catch (error) {
                    console.log(`   ❌ ${username} creation failed - Invalid JSON response`);
                }
                resolve();
            });
        });
        
        req.on('error', (error) => {
            console.log(`   ❌ ${username} creation failed - Network error:`, error.message);
            resolve();
        });
        
        req.write(postData);
        req.end();
    });
}

createBrokerUsers();