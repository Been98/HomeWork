#include <iostream>
#include <string>
#include <vector>
#include <cstdlib>
#include <ctime>

using namespace std;

class Nation{
string n, s;
public : 
    Nation(string n, string s){
        this-> n = n;
        this-> s = s;
    }
    string getN(){return n;}
    string getS(){return s;}

};

int main()
{
    srand(time(nullptr));
    vector <Nation> v;
    int count;
    string a, b;
    Nation n[] = {Nation("미국", "와싱턴"), Nation("영국", "런던"), Nation("프랑스", "파리"),
                  Nation("중국", "베이찡"), Nation("일본", "도쿄"), Nation("러시아", "모스크바"),
                  Nation("브라질", "브라질리아"), Nation("독일", "베를린"), Nation("멕시코", "멕시코시티")};
    for (int i = 0; i < 9; i++)
        v.push_back(n[i]);
    cout << "   ==game start==  "<<endl;
    while(true){
        cout << "정보 입력: 1, 퀴즈: 2, 종료: 3 >>";
        cin >> count;
        if(count == 3)
            break;
        switch (count)
        {
        case 1:
            cout <<"현재" << v.size()<<"개의 나라가 입력되어 있습니다."<<endl;
            cout <<"나라와 수도를 입력하세요(no no이면 입력 끝)"<<endl;
            while(true){
                cout<<v.size()+1 <<">>"<<endl;
                cin >>a>> b;
                if(a == "no" && b== "no")
                    break;
                v.push_back(Nation(a,b));
            }
            break;
        case 2:
            while(true){
                int i = rand()%v.size();
                cout << v[i].getN() <<"의 수도는?";
                cin>>a;

                if(a == v[i].getS())
                    cout<<"Good!!"<<endl;
                else if(a == "exit")
                    break;
                else
                    cout<<"No !!"<<endl;
            }
            break;
        default:
            cout<<" 다시 입력   "<<endl;
            break;
        }

    }
}
