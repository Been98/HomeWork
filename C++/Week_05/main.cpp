#include <iostream>
#include "TV.h"

using namespace std;
int main()
{
    TV tv;
    tv.powerOn();
    tv.state();
    tv.increaseVolume();
    cout << "볼륨 " << CON::INC << " 증가" << endl;
    tv.state();
    cout << tv.getVolume() << endl;
    return 0;
}