#include <iostream>
#include <string>
#include <memory>
#include <vector>

using namespace std;

int main(){
    int size;
    string name;
    string v1 = "tree";
    string v2;
    bool flag = true;
    cout << "끝말 잇기 게임을 시작합니다 "<<endl;
    cout <<" 게임에 참가하는 인원은 몇명입니까? "<<endl;
    cin >> size;
    auto arr = make_unique<string[]>(size);
    for(int i =0; i < size; i++){
        cout <<"참가자의 이름을 입력하세요. 빈칸 없이 >>";
        cin >>name;
        arr[i] = name;
    }
    cout << "시작하는 단어는 "<<v1<<"입니다."<<endl;
    
    while(flag){
        for(int i =0 ; i < size; i++){
            cout << arr[i] <<" >> ";
            cin >>v2;
            if(v1.substr(v1.size()-1) == v2.substr(0,1)){
                v1 = v2;
                continue;
            }
            else{
                cout << arr[i] <<"이 졌습니다. 계속하려면 아무 키나 누르십시오 ..."<<endl;
                flag = false;
                break;
            }
        }
    }


    return 0;
}