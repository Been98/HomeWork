#include <iostream>
#include <string>

using namespace std;

template <typename T>
bool search(T a,T b[], int c){
    for(int i= 0; i <c; i++){
        if(a == b[i])
            return true;
    }
    return false;
}

int main()
{   
    int x[] = {1,10,100,5,4};
    if(search (100,x,5))
        cout << "100이 배열 x에 포함되어 있다";
    else
        cout << "100이 배열 x에 포함되어 있지 않다";

    cout << endl;

    double x2[] = {1.2, 10.3, 100.3, 5.4, 4.5};
    if (search(100.6, x2, 5))
        cout << "100이 배열 x에 포함되어 있다";
    else
        cout << "100이 배열 x에 포함되어 있지 않다";
    cout <<endl;
    char x3[] = {'1', '3', '9', '5', '4'};
    if (search('5', x3, 5))
        cout << "100이 배열 x에 포함되어 있다";
    else
        cout << "100이 배열 x에 포함되어 있지 않다";
}