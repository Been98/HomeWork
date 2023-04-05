#include <iostream> 
#include "TV.h"
using namespace std;
void TV::powerOn()
{
    on = true;
    channel = 1;
    volume = 1;
}
void TV::powerOff()
{
    on = false;
}
void TV::increaseChannel()
{
    channel += CON::INC;
    if (channel > CON::CMAX)
        channel = CON::CMAX;
}

void TV::decreaseChannel()
{
    channel -= CON::DEC;
    if (channel < 0)
        channel = 0;
}
void TV::increaseVolume()
{
    volume += CON::INC;
    if (volume > CON::VMAX)
        volume = CON::VMAX;
}
void TV::decreaseVolume()
{
    volume -= CON::DEC;
    if (volume < 0)
        volume = 0;
}
void TV::state()
{
    cout << "power >> " << boolalpha << on << endl;
    cout << "volume >> " << volume << endl;
    cout << "channel >> " << channel << endl
         << endl;
}
int TV::getVolume() const
{
    return volume;
}
