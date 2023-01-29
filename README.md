# Heart Beat Monitor
Real-time heart beat monitor prototype using [SignalR](https://learn.microsoft.com/en-us/aspnet/core/signalr) server-sent events.

## Usage

To clone and run this application, you'll need [Git](https://git-scm.com) and [.NET 6+](https://dotnet.microsoft.com/en-us/download) installed on your computer.

From your command line:

```bash
# Clone this repository
$ git clone https://github.com/IarahAlmeida/SignalR.git

# Go into the repository
$ cd SignalR/HeartBeatMonitorPlus

# Run the app
$ dotnet run
```

Copy the URL from the address bar, open another browser instance or tab, and paste the URL in the address bar. The charts are displayed instantly:

![SignalR](img/Sample.gif?raw=true "SignalR")

## Architecture and explanation

This project uses the [SignalR](https://learn.microsoft.com/en-us/aspnet/core/signalr) library to configure a server-sent event hub.

The SignalR Hubs API enables connected clients to call methods on the server. SignalR takes care of everything required to make real-time client-to-server and server-to-client communication possible. In this prototype, a server-sent event hub has been implemented.

![SignalR](img/SignalR.drawio.png?raw=true "SignalR")

Here, the client initiates the connection to the server, which is kept open until a cancel request is sent. When new data becomes available on the channel, the response is immediately sent to the client.

The client plots a real-time chart for two different people, and keeps the visualization for the latest 30 records.