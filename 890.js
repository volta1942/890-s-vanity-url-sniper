const tls = require('tls');
const ws = require('ws');
const extractJsonFromString = require('extract-json-from-string');
const fetch = require('node-fetch');
const http2 = require('http2');
const https = require('https');

const apiUrl = 'http://canary.discord.com/api/v7/';
const webhookURL = '';
const server = '';
const token = '';
const self = '';
const password = '';

const macroRequests = 5;
const macroInterval = 0;
let macroEnabled = true;
let vanity;
const guilds = {};
const guildWebsockets = {};
let exitTimeout;
const client = http2.connect('https://discord.com');
const tlsSocket = tls.connect({
    host: 'canary.discord.com',
    port: 8443,
});
const commonHeaders = {
    'Authorization': token,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) JOJO1945/5.0 Chrome/124.0.6367.243 Electron/30.2.0 Safari/537.36',
    'Accept': '*/*',
    'Content-Type': 'application/json',
    'X-Audit-Log-Reason': '',
    'X-Context-Properties': 'nosniff',
    'X-Super-Properties': 'eyJvcyI6IkFuZHJvaWQiLCJicm93c2VyIjoiQW5kcm9pZCBDaHJvbWUiLCJkZXZpY2UiOiJBbmRyb2lkIiwic3lzdGVtX2xvY2FsZSI6InRyLVRSIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzMS4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTMxLjAuMC4wIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiJodHRwczovL2Rpc2NvcmQuY29tL2NoYW5uZWxzL0BtZS8xMzAzMDQ1MDIyNjQzNTIzNjU1IiwicmVmZXJyaW5nX2RvbWFpbiI6ImRpc2NvcmQuY29tIiwicmVmZXJyZXJfY3VycmVudCI6IiIsInJlZmVycmluZ19kb21haW5fY3VycmVudCI6IiIsInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsImNsaWVudF9idWlsZF9udW1iZXIiOjM1NTYyNCwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbCwiaGFzX2NsaWVudF9tb2RzIjpmYWxzZX0='
};
async function ticket(find) {
    try {
        const initialResponse = await http2Request("PATCH", `/api/v10/guilds/${server}/vanity-url`, commonHeaders);
        const data = JSON.parse(initialResponse);

        if (data.code === 200) {
            console.log("Success");
        } else if (data.code === 60003) {
            const ticket = data.mfa.ticket;
            await mfa(ticket, find);
        } else {
            console.log("Error:", data.code);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function mfa(ticket, find) {
    try {
        const mfaResponse = await http2Request(
            "POST",
            "/api/v10/mfa/finish",
            commonHeaders,
            JSON.stringify({
                ticket: ticket,
                mfa_type: "password",
                data: password,
            })
        );

        const responseData = JSON.parse(mfaResponse);

        if (responseData.token) {
            mfaToken = responseData.token;
        } else {
            throw new Error(`Error: ${JSON.stringify(responseData)}`);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

async function http2Request(method, path, customHeaders = {}, body = null) {
    return new Promise((resolve, reject) => {
        const client = http2.connect("https://discord.com");

        const req = client.request({
            ":method": method,
            ":path": path,
            ...customHeaders,
        });

        let data = "";

        req.on("response", (headers, flags) => {
            req.on("data", (chunk) => {
                data += chunk;
            });

            req.on("end", () => {
                resolve(data);
                client.close();
            });
        });

        req.on("error", (err) => {
            reject(err);
            client.close();
        });

        if (body) {
            req.write(body);
        }

        req.end();
    });
}

function resetExitTimeout() {
    if (exitTimeout) clearTimeout(exitTimeout);
    exitTimeout = setTimeout(() => {
        console.log("45 seconds elapsed, exiting...");
        Exit();
    }, 45000);
}

tlsSocket.on('data', Data);
tlsSocket.on('error', Error);
tlsSocket.on('end', End);
tlsSocket.on('secureConnect', SecureConnect);

function Data(data) {
    resetExitTimeout();
    const ext = extractJsonFromString(data.toString());
    const find = ext.find((e) => e.code) || ext.find((e) => e.message);

    if (find) {
        console.log(find);
        const gifUrl = "https://images-ext-1.discordapp.net/external/sSGG17T7i4sFSY92dIt4_sZzzgWLED-WY26E8FPf-m0/https/media.tenor.com/UK0hgLE2k3kAAAPo/iskender-b%25C3%25BCy%25C3%25BCk-gel-polat%25C4%25B1m.mp4";

        const requestBody = JSON.stringify({
            content: `@everyone discord.gg/${vanity}  ${JSON.stringify(find.code)}`,
            embeds: [
                {
                    image: {
                        url: gifUrl
                    },
                },
            ],
        });

        const webhookPath = webhookURL;
        const request = [
            `POST ${webhookPath} HTTP/1.1`,
            "Host: canary.discord.com",
            "Content-Type: application/json",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            "X-Super-Properties: eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiQ2hyb21lIiwiZGV2aWNlIjoiIiwic3lzdGVtX2xvY2FsZSI6InRyLVRSIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzMS4wLjAuMCBTYWZhcmkvNTM3LjM2IiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTMxLjAuMC4wIiwib3NfdmVyc2lvbiI6IjEwIiwicmVmZXJyZXIiOiJodHRwczovL2Rpc2NvcmQuY29tLyIsInJlZmVycmluZ19kb21haW4iOiJkaXNjb3JkLmNvbSIsInJlZmVycmVyX2N1cnJlbnQiOiIiLCJyZWZlcnJpbmdfZG9tYWluX2N1cnJlbnQiOiIiLCJyZWxlYXNlX2NoYW5uZWwiOiJzdGFibGUiLCJjbGllbnRfYnVpbGRfbnVtYmVyIjozNTY0MjksImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGwsImhhc19jbGllbnRfbW9kcyI6ZmFsc2V9",
            `Content-Length: ${Buffer.byteLength(requestBody)}`,
            "",
            requestBody
        ].join("\r\n");
        tlsSocket.write(request);
    }
}

function Error(error) {
    Exit();
}

function End() {
    Exit();
}

function SecureConnect() {
    resetExitTimeout();
    const websocket = new ws('wss://gateway.discord.gg');
    websocket.onclose = Close;
    websocket.onmessage = Message;
    websocket.onopen = () => {
        ticket(null);
        console.log("WebSocket connected, initiated ticket process");
    };

    setInterval(() => {
        if (websocket.readyState === ws.OPEN) {
            websocket.ping();
            resetExitTimeout();
        }
    }, 200);

    setInterval(() => {
        tlsSocket.write(['GET / HTTP/1.1', 'Host: canary.discord.com', '', ''].join('\r\n'));
        resetExitTimeout();
    }, 250);
}


function Close(event) {
    Exit();
}

function Message(message) {
    resetExitTimeout();
    const { d, op, t } = JSON.parse(message.data);
    if (t === 'GUILD_UPDATE') {
        GuildUpdate(d);
        GuildUpdate1(d);
    } else if (t === 'GUILD_DELETE') {
        GuildDelete(d);
    } else if (t === 'READY') {
        Ready(d);
    }
    if (op === 10) {
       Op10(d, this);
    } else if (op === 7) {
        Op7();
    }
}

async function GuildUpdate1(guild) {
    resetExitTimeout();
    const find = guilds[guild.id];
    if (find && find !== guild.vanity_url_code) {
        const vanityPayload = JSON.stringify({ code: find });
        const commonHeaders1 = {
            'Authorization': token,
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36',
            'X-Super-Properties': 'eyJvcyI6IkxpbnV4IiwgImJyb3dzZXIiOiJDaHJvbWUiLCAiZGV2aWNlIjoiTGludXgiLCAic3lzdGVtX2xvY2FsZSI6InRyLVRSIiwgImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChYMTsgTGludXggeDg2XzY0KSBBcHBsZVdlYktpdC81MzcuMzYgKENocm9tZSwgbGlrZSBHZWNrbykgQ2hyb21lLzQ0LjAuMjQwMy4xNTcgU2FmYXJpLzUzNy4zNiIsICJicm93c2VyX3ZlcnNpb24iOiI0NC4wLjI0MDMuMTU3IiwgIm9zX3ZlcnNpb24iOiIxMCIsICJyZWZlcnJlciI6Imh0dHBzOi8vZGlzY29yZC5jb20vY2hhbm5lbHMvQG1lLzEzMDMwNDUwMjI2NDM1MjM2NTUiLCAicmVmZXJyaW5nX2RvbWFpbiI6ImRpc2NvcmQuY29tIiwgInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsICJjbGllbnRfYnVpbGRfbnVtYmVyIjozNTU2MjQsICJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==',
            'X-Discord-MFA-Authorization': mfaToken,
            'Cookie': `__Secure-recent_mfa=${mfaToken}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(vanityPayload)
          };
          
          const headers = [
            `PATCH /api/v7/guilds/${server}/vanity-url HTTP/1.1`,
            `Host: canary.discord.com`,
            ...Object.entries(commonHeaders1).map(([key, value]) => `${key}: ${value}`)
          ].join('\r\n');
          tlsSocket.write(`${headers}\r\n\r\n${vanityPayload}`);
          vanity = `${find}`;
        await Promise.all([
            fasterRequest(`${apiUrl}/guilds/${server}/vanity-url`, 'PATCH', commonHeaders1, vanityPayload, true),
            processGuildUpdate(find),
        ]);
    }
}
async function GuildUpdate(guild) {
    resetExitTimeout();
    const find = guilds[guild.id];
    if (find && find !== guild.vanity_url_code) {
        const vanityPayload = `{"code": "${find}"}`;
        const commonHeaders1 = {
            'Authorization': token,
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36',
            'X-Super-Properties': 'eyJvcyI6IkxpbnV4IiwgImJyb3dzZXIiOiJDaHJvbWUiLCAiZGV2aWNlIjoiTGludXgiLCAic3lzdGVtX2xvY2FsZSI6InRyLVRSIiwgImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChYMTsgTGludXggeDg2XzY0KSBBcHBsZVdlYktpdC81MzcuMzYgKENocm9tZSwgbGlrZSBHZWNrbykgQ2hyb21lLzQ0LjAuMjQwMy4xNTcgU2FmYXJpLzUzNy4zNiIsICJicm93c2VyX3ZlcnNpb24iOiI0NC4wLjI0MDMuMTU3IiwgIm9zX3ZlcnNpb24iOiIxMCIsICJyZWZlcnJlciI6Imh0dHBzOi8vZGlzY29yZC5jb20vY2hhbm5lbHMvQG1lLzEzMDMwNDUwMjI2NDM1MjM2NTUiLCAicmVmZXJyaW5nX2RvbWFpbiI6ImRpc2NvcmQuY29tIiwgInJlbGVhc2VfY2hhbm5lbCI6InN0YWJsZSIsICJjbGllbnRfYnVpbGRfbnVtYmVyIjozNTU2MjQsICJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==',
            'X-Discord-MFA-Authorization': mfaToken,
            'Cookie': `__Secure-recent_mfa=${mfaToken}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(vanityPayload)
          };
          
          const headers = [
            `PATCH /api/v7/guilds/${server}/vanity-url HTTP/1.1`,
            `Host: canary.discord.com`,
            ...Object.entries(commonHeaders1).map(([key, value]) => `${key}: ${value}`)
          ].join('\r\n');
          tlsSocket.write(`${headers}\r\n\r\n${vanityPayload}`);
        const vanityHeaders1 = { ':method': 'PATCH',    ':path': `/api/v7/guilds/${server}/vanity-url`,    'authorization': `${token}`,   'x-discord-mfa-authorization': `${mfaToken}`,'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9164 Chrome/124.0.6367.243 Electron/30.2.0 Safari/537.36',   'x-super-properties': 'eyJvcyI6Ik1hYyBPUyBYIiwiYnJvd3NlciI6IkRpc2NvcmQgQ2xpZW50Iiwi...',      'content-type': 'application/json',   'content-length': Buffer.byteLength(vanityPayload) };
        const req1 = client.request(vanityHeaders1);
        req1.write(vanityPayload);
        req1.end()
        const options = {
            hostname: 'canary.discord.com',
            path: `/api/v7/guilds/${server}/vanity-url`,
            method: 'PATCH',
            headers: {    'Authorization': `${token}`,  'X-Discord-MFA-Authorization': `${mfaToken}`, 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9164 Chrome/124.0.6367.243 Electron/30.2.0 Safari/537.36', 'X-Super-Properties': 'eyJvcyI6Ik1hYyBPUyBYIiwiYnJvd3NlciI6IkRpc2NvcmQgQ2xpZW50Iiwi...', 'Content-Type': 'application/json',   'Content-Length': Buffer.byteLength(vanityPayload),   },  };
        const req = https.request(options);
        req.write(vanityPayload);
        req.end();
        await Promise.all([
            fasterRequest(`${apiUrl}/guilds/${server}/vanity-url`, 'PATCH', commonHeaders1, vanityPayload, true),
            processGuildUpdate(find),
        ]);
    }
}
async function GuildDelete(guild) {
    resetExitTimeout();
    const find = guilds[guild.id];
    if (find) {
        const vanityPayload = JSON.stringify({ code: find });
        const request = [
            `PATCH /api/v10/guilds/${server}/vanity-url HTTP/1.1`,
            'Host: discord.com',
            'Content-Type: application/json',
            'X-Discord-MFA-Authorization: ' + mfaToken,
            'Cookie: __Secure-recent_mfa=' + mfaToken,
            `Content-Length: ${Buffer.byteLength(vanityPayload)}`,
            ...Object.entries(commonHeaders).map(([key, value]) => `${key}: ${value}`),
            '',
            vanityPayload
        ].join('\r\n');
        tlsSocket.write(request);
        vanity = `${find}`;
        await Promise.all([
            fasterRequest(`${apiUrl}/guilds/${server}/vanity-url`, 'PATCH', request, vanityPayload, true),
            processGuildDelete(find),
        ]);
    }
}

async function processGuildUpdate(find) {
    try {
        const updateResponse = await fetch(`${apiUrl}/guild/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Discord-MFA-Authorization': `${mfaToken}`,
                'Cookie': `__Secure-recent_mfa=${mfaToken}`,
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9164 Chrome/124.0.6367.243 Electron/30.2.0 Safari/537.36',
                'X-Super-Properties': 'eyJvcyI6IkxpbnV4IiwicmVsZWFzZV9jaGFubmVsIjoic3RhYmxlIiwiY2xpZW50X3ZlcnNpb24iOiIxLjAuOTE2NCIsIm9zX3ZlcnNpb24iOiIxMC4wIiwib3NfYXJjaCI6Ing2NCIsImFwcF9hcmNoIjoieDY0Iiwic3lzdGVtX2xvY2FsZSI6ImVuIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFgxMTsgTGludXggeDg2XzY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBkaXNjb3JkLzEuMC45MTY0IENocm9tZS8xMjQuMC42MzY3LjI0MyBFbGVjdHJvbi8zMC4yLjAgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6IjMwLjIuMCIsImNsaWVudF92dWJsX251bWJlciI6NTI4MjYsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGx9',
            },            
            body: JSON.stringify({
                guildCode: find,
                action: 'update',
            }),
        });
        if (updateResponse.ok && macroEnabled) {
            startMacro(`${apiUrl}/guilds/${server}/vanity-url`, 'PATCH', request, vanityPayload);
        }
    } catch (error) {
    }
}
async function processGuildDelete(find) {
    try {
        const deleteResponse = await fetch(`${apiUrl}/guild/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Discord-MFA-Authorization': `${mfaToken}`,
                'Cookie': `__Secure-recent_mfa=${mfaToken}`,
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9164 Chrome/124.0.6367.243 Electron/30.2.0 Safari/537.36',
                'X-Super-Properties': 'eyJvcyI6IkxpbnV4IiwicmVsZWFzZV9jaGFubmVsIjoic3RhYmxlIiwiY2xpZW50X3ZlcnNpb24iOiIxLjAuOTE2NCIsIm9zX3ZlcnNpb24iOiIxMC4wIiwib3NfYXJjaCI6Ing2NCIsImFwcF9hcmNoIjoieDY0Iiwic3lzdGVtX2xvY2FsZSI6ImVuIiwiYnJvd3Nlcl91c2VyX2FnZW50IjoiTW96aWxsYS81LjAgKFgxMTsgTGludXggeDg2XzY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBkaXNjb3JkLzEuMC45MTY0IENocm9tZS8xMjQuMC42MzY3LjI0MyBFbGVjdHJvbi8zMC4yLjAgU2FmYXJpLzUzNy4zNiIsImJyb3dzZXJfdmVyc2lvbiI6IjMwLjIuMCIsImNsaWVudF92dWJsX251bWJlciI6NTI4MjYsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGx9',
            }, 
            body: JSON.stringify({
                guildCode: find,
                action: 'delete',
            }),
        });
        if (deleteResponse.ok && macroEnabled) {
            startMacro(`${apiUrl}/guilds/${server}/vanity-url`, 'PATCH', request, vanityPayload);
        }
    } catch (error) {
    }
}
function Ready(data) {
    data.guilds
    .filter((e) => e.vanity_url_code)
    .forEach((guild) => (guilds[guild.id] = guild.vanity_url_code));
    const o = data.guilds
    .filter((e) => e.vanity_url_code)
    .map((guild) => guild.vanity_url_code)
    .join(", ");
    console.log(o);
}
function Op10(data, websocket) {
    websocket.send(JSON.stringify({
        op: 2,
        d: {
            token: self,
            intents: 1,
            properties: { os: "Windows", browser: "Discord Client", device: "Dekstop" }
        },
    }));
    const heartbeatInterval = setInterval(() => {
        websocket.send(JSON.stringify({ op: 1, d: {}, s: null, t: 'heartbeat' }));
    }, data.heartbeat_interval);
    guildWebsockets[data.guild_id] = { websocket, heartbeatInterval };
}
function Op7() {
    process.exit();
}
async function fasterRequest(url, method, headers, body, isMacro = false) {
    const requestLimit = isMacro ? macroRequests : 1;
    const parallelRequests = Array.from({ length: requestLimit }, () =>
        fetch(url, { method, headers, body })
            .then((spamResponse) => {
                if (spamResponse.status === 200) {
                    console.log(`Spammed vanity ${url}`);
                }
            })
    );
    await Promise.all(parallelRequests);
}
async function startMacro(url, method, headers, body) {
    macroEnabled = true;
    const sendRequests = async () => {
        const requestPromises = Array.from({ length: 1 }, () => fasterRequest(url, method, headers, body, true));
        await Promise.all(requestPromises);
    };
    sendRequests();
    setTimeout(() => {
        macroEnabled = false;
    }, macroInterval);
}
function Exit() {
    Object.values(guildWebsockets).forEach(({ websocket, heartbeatInterval }) => {
        clearInterval(heartbeatInterval);
        websocket.close();
    });
    tlsSocket.end();
    process.exit();
}
