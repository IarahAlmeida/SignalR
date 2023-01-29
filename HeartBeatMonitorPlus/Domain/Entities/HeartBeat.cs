namespace SignalRAcme.Domain.Entities
{
    public class HeartBeat
    {
        private double _x;

        public string Name { get; set; } = string.Empty;

        public DateTime StartTime { get; private set; } = DateTime.Now;

        public double Y { get; private set; }

        public double X
        {
            get
            {
                return _x;
            }
            set
            {
                if (_x == value)
                {
                    return;
                }

                _x = value;

                Y = -0.06366 + 0.12613 * Math.Cos(Math.PI * _x / 500.0) + 0.12258 * Math.Cos(Math.PI * _x / 250.0) + 0.01593 * Math.Sin(Math.PI * _x / 500) + 0.03147 * Math.Sin(Math.PI * _x / 250.0);
            }
        }
    }
}