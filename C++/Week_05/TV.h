#ifndef TV_H 
#define TV_H
//헤더파일 중복 방지 
namespace CON
{
    enum
    {
        INC = 2,
        DEC = 2,
        VMAX = 100,
        CMAX = 999
    };
};
class TV
{
    bool on;
    int channel;
    int volume;

public:
    void powerOn();
    void powerOff();

    void increaseChannel();
    void decreaseChannel();
    void increaseVolume();
    void decreaseVolume();
    void state();
    int getVolume() const;
};
#endif // !TV_H