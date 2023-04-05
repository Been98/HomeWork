#include <iostream>
#include <string>
#include <memory>

using namespace std;

int main()
{
    string name;
    char search;
    int count;
    cout<< "문자열 입력>>";
    getline(cin,name);
    cout<<"검색하고자 하는 문자 입력 >>";
    cin >> search;
    for(int i = 0; i < name.size();i++){
        if(name.at(i) == search)
            count++;
    }
    cout <<"문자 " << search<< "는 "<< count<<"개 있습니다." <<endl;
}