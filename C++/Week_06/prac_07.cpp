#include <iostream>
#include <string>
#include <cstdlib>
#include <ctime>
#include <vector>
#include <array>

using namespace std;

class Player{
    vector<string> arr;
    array<int,3> arr2;
    int size;
    string name;
public :
    Player(int size);
    void game();
    ~Player(){;}
};
Player::Player(int size){
    this->size = size;
    //vector<string> arr; // 2
    for(int i =0; i<size;i++){
        cout << i + 1 << "번 째 선수 이름 >>";
        cin >> name;
        arr.push_back(name);
        //arr[i] = name;
        cout << arr[i]<<endl;
    }
    game();
}
void Player::game(){
    bool flag = true;
    srand(time(nullptr));
    cin.ignore();
    cout <<arr[0]<<" "<<arr[1]<<endl;
    while(flag){
        for(int i = 0; i < size; i++){
            cout <<arr[i]<<": <Enter>";
            getline(cin,name);
            arr2[0] = rand() %3 +1;
            arr2[1] = rand() % 3 + 1;
            arr2[2] = rand() % 3 + 1;
            cout<<'\t' << arr2[0] << '\t' << arr2[1] << '\t' << arr2[2] << '\t';
            if(arr2[0]== arr2[1] && arr2[0]==arr2[2]){
                flag = false;
                cout << arr[i]<<"님 승리 !"<<endl;
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
    Player *p;
    cout << "***** 갬블링 게임을 시작합니다. *****"<<endl;
    cout << "선수의 수를 입력하세요 :";
    cin >> size;
    p = new Player(size);
    delete p;
    return 0;
}