#include <iostream>
#include <string>
#include <vector>
#include <ctime>
#include <cstdlib>

using namespace std;

class Nation{
    string s1;
    string s2;
public:
    Nation(string s1, string s2):s1(s1),s2(s2){};
    string getS1(){return s1;}
    string getS2(){return s2;}
};


int main()
{
    vector<Nation> v;
    int count = 0;
    bool flag = true;
    string ans;
    string j, k;
    srand(time(nullptr));

    Nation n[] = {Nation("미국", "와싱턴"), Nation("영국", "런던"), Nation("프랑스", "파리"),
                  Nation("중국", "베이찡"), Nation("일본", "도쿄"), Nation("러시아", "모스크바"),
                  Nation("브라질", "브라질리아"), Nation("독일", "베를린"), Nation("멕시코", "멕시코시티")};
    for (int i = 0; i < 9; i++)
        v.push_back(n[i]);
 
    cout << "***** 나라의 수도 맞추기 게임을 시작합니다. *****" << endl;
    while (flag)
    {
        cout << "정보 입력 : 1, 퀴즈: 2, 종료: 3 >>";
        cin >> count;
        switch (count)
        {
        case 1:
            cout << "현재 " << v.size()<<"개의 나라가 입력되어 있습니다."<<endl;
            cout<<"나라와 수도를 입력하세요 (no no이면 입력끝)"<<endl;
            while(true){
                cout<< v.size()+1<<">>";
                cin>>j>>k;
                if(j=="no"&&k=="no")
                    break;
                n[v.size() + 1] = Nation(j, k);
                v.push_back(n[v.size() + 1]);
            }
            break;
        case 2:
            while(true){
                int b =rand()%v.size();
                cout <<v[b].getS1()<<"의 수도는 ?";
                cin>> ans;
                if(ans == v[b].getS2()){
                    cout << "Correct !!"<<endl;
                }
                else if(ans == "exit"){
                    break;
                }
                else{
                    cout << "NO !!"<<endl;
                }
            }
            break;
        case 3:
            flag = false;
            break;
        default:
            cout <<"다시 입력해주세요 "<<endl;
            break;
        }
    }
}