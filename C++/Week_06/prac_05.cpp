#include <iostream>
#include <string>
#include <ctime>
#include <cstdlib>
#include <vector>
#include <array>

using namespace std;

class Player{
   
    array<int,3> numArr;
    vector<string> arr;
    string name;
    string as;
    int size;
    bool flag = true;
public:
    Player(int n);
    void setName(int i,string name);
    void gamePlay();
};
Player::Player(int n){
    size = n;
    arr = vector<string>(size);
}
void Player::setName(int i,string name){
    this->name = name;
    arr[i] = name;
   //arr.push_back(name);
}
void Player::gamePlay(){
    cin.ignore();
    srand(time(nullptr));
    while(flag){
        for(int i =0; i < arr.size();i++){
            cout << arr[i] <<" : <Enter>";
            getline(cin,as);
            numArr[0] = rand()%3 +1;
            numArr[1] = rand()%3 +1;
            numArr[2] = rand() % 3 + 1;
            cout << '\t' <<numArr[0] <<'\t'<< numArr[1]<<'\t'<<numArr[2]<<'\t';
            if (numArr[0] == numArr[1] && numArr[0] == numArr[2]){
                cout << arr[i]<<"님 승리!!"<<endl;
                flag = false;
                break;
            }
            else
                cout <<"아쉽군요 !"<<endl;
        }
    }
}

int main()
{
    int size;
    string name;
    cout << " ***** 겜블링 게임을 시작합니다. *****"<<endl;
    cout << "플레이 할 선수의 수 :";
    cin >> size;
    Player *p = new Player(size);
    for(int i = 0; i < size; i++){
        cout << i+1 <<"번 째 선수 이름 >>";
        cin >> name;
        p->setName(i,name);
    }
    p->gamePlay();

    delete p;
    return 0;
}