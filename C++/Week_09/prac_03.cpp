#include <iostream>
using namespace std;

class Accumulator
{
    int value;

public:
    Accumulator(int val) : value{val} {}; //누적저장
    Accumulator &add(int n); //*this
    int get() { return value; }
};

Accumulator &Accumulator::add(int n){ 
    value += n;
    return *this;
}

int main()
{
    Accumulator acc(10);
    cout << acc.get() << endl; // 10 출력

    acc.add(1).add(2).add(3);  // acc 객체의 value는 15가 됨.
    cout << acc.get() << endl; // 16 출력
}
