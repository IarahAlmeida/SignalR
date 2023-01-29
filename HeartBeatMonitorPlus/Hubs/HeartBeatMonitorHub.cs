using Microsoft.AspNetCore.SignalR;
using SignalRAcme.Domain.Entities;
using System.Threading.Channels;

namespace SignalRAcme.Hubs
{
    public class HeartBeatMonitorHub : Hub
    {
        private readonly int _updateInterval = 150;

        private readonly List<HeartBeat> _heartBeats = new();

        private readonly System.Timers.Timer _timer;

        public HeartBeatMonitorHub()
        {
            // adds first person monitoring
            _heartBeats.Add(new HeartBeat { Name = "Iarah", X = 0 });

            // creates a timer to insert the second person monitoring
            _timer = new System.Timers.Timer(5500);
            _timer.Elapsed += (sender, e) => AddNextHeartBeat();
            _timer.Start();
        }

        public ChannelReader<HeartBeat> GetHeartBeatWithChannelReader(CancellationToken cancellationToken)
        {
            var channel = Channel.CreateUnbounded<HeartBeat>();

            _ = WriteItemsAsync(channel.Writer, cancellationToken);

            return channel.Reader;
        }

        private async Task WriteItemsAsync(ChannelWriter<HeartBeat> writer, CancellationToken cancellationToken)
        {
            try
            {
                while (true)
                {
                    cancellationToken.ThrowIfCancellationRequested();

                    foreach (var heartBeat in _heartBeats)
                    {
                        heartBeat.X = (DateTime.Now - heartBeat.StartTime).TotalMilliseconds;

                        await writer.WriteAsync(heartBeat, cancellationToken);
                    }

                    await Task.Delay(_updateInterval, cancellationToken);
                }
            }
            catch (Exception ex)
            {
                writer.TryComplete(ex);
            }

            writer.TryComplete();
        }

        private void AddNextHeartBeat()
        {
            _heartBeats.Add(new HeartBeat { Name = "Rafael", X = 550 });

            _timer.Stop();
            _timer.Dispose();
        }
    }
}